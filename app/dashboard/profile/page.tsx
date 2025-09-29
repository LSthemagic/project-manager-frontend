"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getUploadUrl } from "@/lib/api";

const profileFormSchema = z.object({
  nome: z
    .string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
});

const passwordFormSchema = z.object({
  senhaAtual: z.string().min(1, { message: "A senha atual é obrigatória." }),
  novaSenha: z
    .string()
    .min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
});

const updateProfile = (data: z.infer<typeof profileFormSchema>) =>
  api.put("/auth/me", data);
const changePassword = (data: z.infer<typeof passwordFormSchema>) =>
  api.put("/auth/change-password", data);

export default function ProfilePage() {
  const { user, refreshUser } = useAuth(); // Usaremos refreshUser após mudanças

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const initialProfilePicture =
    (user as unknown as { profile_picture?: string })?.profile_picture || null;
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    initialProfilePicture
  );

  // Update preview when user.profile_picture changes (e.g., after refreshUser)
  useEffect(() => {
    if (!avatarFile) {
      const raw =
        (user as unknown as { profile_picture?: string })?.profile_picture ||
        null;
      const newPic = raw ? getUploadUrl(raw) : null;
      setAvatarPreview(newPic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.profile_picture]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (
        avatarPreview &&
        avatarPreview.startsWith &&
        avatarPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isAxiosErrorWithMessage(
    e: unknown
  ): e is { response: { data: { message?: string } } } {
    if (typeof e !== "object" || e === null) return false;
    const r = (e as Record<string, unknown>)["response"];
    if (typeof r !== "object" || r === null) return false;
    const d = (r as Record<string, unknown>)["data"];
    return typeof d === "object" && d !== null;
  }

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      nome: user?.nome || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { senhaAtual: "", novaSenha: "" },
  });

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: async () => {
      toast.success("Perfil atualizado com sucesso!");
      // Atualiza os dados do usuário no contexto
      await refreshUser();
    },
    onError: () => {
      toast.error("Ocorreu um erro ao atualizar o perfil.");
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Senha alterada com sucesso! Você será desconectado.");
      // A API já destrói a sessão, o frontend irá redirecionar automaticamente.
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro ao alterar a senha.";
      toast.error(message);
    },
  });

  const onProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    profileMutation.mutate(values);
  };

  const onPasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    passwordMutation.mutate(values);
  };

  const handleAvatarChange = (file?: File) => {
    if (!file) return setAvatarFile(null);
    setAvatarFile(file);
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return toast.error("Selecione uma imagem primeiro.");
    const formData = new FormData();
    formData.append("file", avatarFile, avatarFile.name);

    try {
      await api.put("/auth/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Avatar enviado com sucesso!");
      await refreshUser();
      // Clear local file selection so preview will sync with server value
      setAvatarFile(null);
      // revoke preview object URL
      if (
        avatarPreview &&
        avatarPreview.startsWith &&
        avatarPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(avatarPreview);
      }
    } catch (err: unknown) {
      let message = "Erro ao enviar avatar.";
      if (isAxiosErrorWithMessage(err) && err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      toast.error(message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-semibold leading-tight">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie suas informações pessoais e configurações de segurança.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <aside className="lg:col-span-1">
          <Card className="bg-white/80 border hover:shadow-lg transition-shadow duration-150">
            <CardContent>
              <div className="flex flex-col items-center text-center space-y-4 py-6">
                <div>
                  <Avatar className="h-28 w-28">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={user?.nome} />
                    ) : (
                      <AvatarFallback className="text-2xl font-semibold text-gray-700">
                        {user?.nome ? user.nome.charAt(0).toUpperCase() : "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                <div>
                  <p className="font-medium text-lg">
                    {user?.nome || "Usuário"}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>

                <p className="text-xs text-center text-muted-foreground max-w-[200px]">
                  Perfil público mínimo — mantenha suas informações atualizadas.
                </p>

                <div className="w-full mt-3">
                  <label className="relative flex items-center justify-center h-10 rounded-md bg-muted/60 hover:bg-muted/80 border border-dashed border-gray-200 cursor-pointer text-sm text-muted-foreground">
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleAvatarChange(
                          e.target.files ? e.target.files[0] : undefined
                        )
                      }
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <span className="pointer-events-none">
                      Escolher arquivo
                    </span>
                  </label>

                  <div className="flex gap-2 mt-3 justify-center sm:justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setAvatarFile(null);
                        setAvatarPreview(initialProfilePicture || null);
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={uploadAvatar}
                      disabled={!avatarFile}
                    >
                      {avatarFile ? "Upload" : "Upload"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <main className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  className="grid grid-cols-1 gap-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={profileForm.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Seu nome" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              {...field}
                              placeholder="seu@exemplo.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={profileMutation.isPending}
                      className="flex items-center"
                    >
                      {profileMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Salvar
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Altere sua senha regularmente para manter sua conta segura.
              </p>
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                  className="grid grid-cols-1 gap-4"
                >
                  <FormField
                    control={passwordForm.control}
                    name="senhaAtual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Senha atual"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={passwordForm.control}
                    name="novaSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nova Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            {...field}
                            placeholder="Nova senha (mín. 6 caracteres)"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={passwordMutation.isPending}
                      className="flex items-center"
                    >
                      {passwordMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Alterar Senha
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
