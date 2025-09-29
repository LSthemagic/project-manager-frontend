"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { Attachment } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, Paperclip, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const fetchAttachments = async (taskId: number): Promise<Attachment[]> => {
  try {
    const { data } = await api.get(`/tasks/${taskId}/attachments`);
    return data;
  } catch (e) {
    console.warn("Could not fetch attachments. Endpoint might be missing.");
    return [];
  }
};

const uploadAttachment = async ({
  taskId,
  file,
}: {
  taskId: number;
  file: File;
}) => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

const deleteAttachment = async (attachmentId: number) => {
  const { data } = await api.delete(`/tasks/attachments/${attachmentId}`);
  return data;
};

const resizeImage = async ({
  attachmentId,
  width,
}: {
  attachmentId: number;
  width: number;
}) => {
  return api.post(`/attachments/${attachmentId}/resize?width=${width}`);
};

const attachmentSchema = z.object({
  file: z
    .instanceof(FileList)
    .refine(
      (files) => files?.length === 1,
      "É necessário selecionar um arquivo."
    ),
});

type AttachmentsTabProps = {
  taskId: number;
};

export function AttachmentsTab({ taskId }: AttachmentsTabProps) {
  const queryClient = useQueryClient();
  const [width, setWidth] = useState(200);

  const { data: attachments, isLoading } = useQuery<Attachment[]>({
    queryKey: ["attachments", taskId],
    queryFn: () => fetchAttachments(taskId),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
      form.reset();
      toast.success("Anexo enviado com sucesso!");
    },
    onError: () => {
      toast.error("Falha no upload. Verifique o arquivo e tente novamente.");
    },
  });

  const resizeMutation = useMutation({
    mutationFn: resizeImage,
    onSuccess: (data) => {
      toast.success("Imagem redimensionada!", {
        description:
          "O link para a nova imagem foi copiado para a área de transferência.",
      });
      navigator.clipboard.writeText(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${data.data.newPath}`
      );
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
    },
    onError: () => {
      toast.error("Falha ao redimensionar a imagem.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments", taskId] });
      toast.success("Anexo excluído com sucesso!");
    },
    onError: () => {
      toast.error("Falha ao excluir o anexo.");
    },
  });

  const form = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
  });

  const onSubmit = (values: z.infer<typeof attachmentSchema>) => {
    uploadMutation.mutate({ taskId, file: values.file[0] });
  };

  const isImage = (fileName: string) =>
    /\.(jpe?g|png|gif|webp)$/i.test(fileName);

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2 max-h-60 overflow-y-auto pr-4">
        {isLoading && <p>Carregando anexos...</p>}
        {attachments?.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between p-2 rounded-md border text-sm"
          >
            <a
              href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${attachment.caminho}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline"
            >
              <Paperclip className="h-4 w-4" />
              {attachment.nome_arquivo}
            </a>
            <div className="flex items-center">
              {isImage(attachment.nome_arquivo) && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Redimensionar Imagem"
                    >
                      <Image className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={width}
                        onChange={(e) => setWidth(Number(e.target.value))}
                        className="w-24"
                        placeholder="Largura (px)"
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          resizeMutation.mutate({
                            attachmentId: attachment.id,
                            width,
                          })
                        }
                        disabled={resizeMutation.isPending}
                      >
                        Redimensionar
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
              <Button
                variant="ghost"
                size="icon"
                title="Excluir anexo"
                onClick={() =>
                  deleteMutation.mutate(
                    typeof attachment.id === "number" ? attachment.id : 0
                  )
                }
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        ))}
        {attachments?.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">
            Nenhum anexo encontrado.
          </p>
        )}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center gap-2"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="file"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? "Enviando..." : "Enviar"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
