'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Attachment } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Trash2 } from 'lucide-react';
import { useState } from 'react';

const fetchAttachments = async (taskId: number): Promise<Attachment[]> => {
  // Nota: Assumindo que o endpoint GET para anexos existe ou será criado.
  // Se não existir, os anexos podem vir junto com os detalhes da tarefa.
  // Por enquanto, esta chamada pode falhar, mas a lógica de upload funcionará.
  try {
    const { data } = await api.get(`/tasks/${taskId}/attachments`);
    return data;
  } catch (e) {
    console.warn("Could not fetch attachments. Endpoint might be missing.");
    return [];
  }
};

const uploadAttachment = async ({ taskId, file }: { taskId: number; file: File }) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const { data } = await api.post(`/tasks/${taskId}/attachments`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

const attachmentSchema = z.object({
  file: z.instanceof(FileList).refine((files) => files?.length === 1, 'É necessário selecionar um arquivo.'),
});

type AttachmentsTabProps = {
  taskId: number;
};

export function AttachmentsTab({ taskId }: AttachmentsTabProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState('');

  const { data: attachments, isLoading } = useQuery<Attachment[]>({
    queryKey: ['attachments', taskId],
    queryFn: () => fetchAttachments(taskId),
  });

  const uploadMutation = useMutation({
    mutationFn: uploadAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attachments', taskId] });
      form.reset();
      setError('');
    },
    onError: () => {
        setError('Falha no upload. Verifique o arquivo e tente novamente.');
    }
  });

  const form = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
  });

  const onSubmit = (values: z.infer<typeof attachmentSchema>) => {
    uploadMutation.mutate({ taskId, file: values.file[0] });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2 max-h-60 overflow-y-auto pr-4">
        {isLoading && <p>Carregando anexos...</p>}
        {attachments?.map((attachment) => (
          <div key={attachment.id} className="flex items-center justify-between p-2 rounded-md border">
            <a href={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${attachment.caminho}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm hover:underline">
              <Paperclip className="h-4 w-4" />
              {attachment.nome_arquivo}
            </a>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
        {attachments?.length === 0 && !isLoading && <p className="text-sm text-muted-foreground">Nenhum anexo encontrado.</p>}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </Form>
    </div>
  );
}