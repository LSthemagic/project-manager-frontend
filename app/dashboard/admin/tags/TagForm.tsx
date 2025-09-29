'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Etiqueta } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';

const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Por favor, insira uma cor hexadecimal válida (ex: #FFFFFF).' }),
});

type TagFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  etiqueta?: Etiqueta | null;
};

const createTag = (data: z.infer<typeof formSchema>) => api.post('/admin/tags', data);
const updateTag = ({ id, ...data }: { id: number } & z.infer<typeof formSchema>) => api.put(`/admin/tags/${id}`, data);

export function TagForm({ isOpen, onOpenChange, etiqueta }: TagFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!etiqueta;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', cor: '#28a745' },
  });

  useEffect(() => {
    if (etiqueta) {
      form.reset({
        nome: etiqueta.nome,
        cor: etiqueta.cor,
      });
    } else {
      form.reset({ nome: '', cor: '#28a745' });
    }
  }, [etiqueta, form]);

  const mutation = useMutation({
    mutationFn: isEditing ? updateTag : createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(`Etiqueta ${isEditing ? 'atualizada' : 'criada'} com sucesso!`);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Ocorreu um erro ao salvar a etiqueta.");
      console.error("Erro ao salvar etiqueta:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSend: any = values;
    if (isEditing) {
      dataToSend.id = etiqueta.id;
    }
    mutation.mutate(dataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Etiqueta' : 'Adicionar Nova Etiqueta'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor</FormLabel>
                  <FormControl><Input type="color" {...field} className="p-1 h-10 w-full" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}