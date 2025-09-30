"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api, { getUploadUrl } from "@/lib/api";
import { Comment, User } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2 } from "lucide-react";
import { AvatarImage } from "@radix-ui/react-avatar";

const fetchComments = async (taskId: number): Promise<Comment[]> => {
  const { data } = await api.get(`/tasks/${taskId}/comments`);
  return data;
};

const addComment = async ({
  taskId,
  conteudo,
}: {
  taskId: number;
  conteudo: string;
}) => {
  const { data } = await api.post(`/tasks/${taskId}/comments`, { conteudo });
  return data;
};

const deleteComment = async (commentId: number) => {
  await api.delete(`/comments/${commentId}`);
};

const commentSchema = z.object({
  conteudo: z
    .string()
    .min(1, { message: "O comentário não pode estar vazio." }),
});

type CommentsTabProps = {
  taskId: number;
};

export function CommentsTab({ taskId }: CommentsTabProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ["comments", taskId],
    queryFn: () => fetchComments(taskId),
  });

  const addMutation = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
      form.reset();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { conteudo: "" },
  });

  const onSubmit = (values: z.infer<typeof commentSchema>) => {
    addMutation.mutate({ taskId, conteudo: values.conteudo });
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const canDelete = (
    commentUser: User | { id: number; tipo_usuario: string }
  ) => {
    if (!user) return false;
    return (
      user.tipo_usuario === "admin" ||
      user.tipo_usuario === "gerente" ||
      user.id === commentUser.id
    );
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
        {isLoading && <p>Carregando comentários...</p>}
        {comments?.map((comment) => (
          console.log(comment),
          <div key={comment.id} className="flex items-start gap-4">
            <Avatar className="h-9 w-9">
              {comment?.usuario_profile_picture ? (
                <AvatarImage
                  src={getUploadUrl(comment?.usuario_profile_picture) || undefined}
                  alt={comment.nome}
                />
              ) : (
                <AvatarFallback>{getInitials(comment?.nome || "")}</AvatarFallback>
              )}
            </Avatar>
            <div className="grid gap-1.5 w-full">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{comment.nome}</p>
                {canDelete({ id: comment.usuario_id, tipo_usuario: "" }) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(comment.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {comment.conteudo}
              </p>
            </div>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-start gap-4"
        >
          <FormField
            control={form.control}
            name="conteudo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Textarea
                    placeholder="Adicione um comentário..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={addMutation.isPending}>
            Comentar
          </Button>
        </form>
      </Form>
    </div>
  );
}
