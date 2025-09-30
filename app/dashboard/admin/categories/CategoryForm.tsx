'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  descricao: z.string().optional(),
  cor: z.string().regex(/^#[0-9A-F]{6}$/i, { message: 'Por favor, insira uma cor hexadecimal válida (ex: #FFFFFF).' }),
});

type CategoryFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  category?: Category | null;
};

const createCategory = (data: z.infer<typeof formSchema>) => api.post('/categories', data);
const updateCategory = (payload: { id: number } & z.infer<typeof formSchema>) => api.put(`/categories/${payload.id}`, payload);

export function CategoryForm({ isOpen, onOpenChange, category }: CategoryFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!category;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', descricao: '', cor: '#007bff' },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        nome: category.nome,
        descricao: category.descricao || '',
        cor: category.cor,
      });
    } else {
      form.reset({ nome: '', descricao: '', cor: '#007bff' });
    }
  }, [category, form]);

  type CategoryPayload = z.infer<typeof formSchema> | ({ id: number } & z.infer<typeof formSchema>);
  const mutation = useMutation<unknown, unknown, CategoryPayload>({
    mutationFn: (payload: CategoryPayload) => {
      if ('id' in payload) {
        return updateCategory(payload as { id: number } & z.infer<typeof formSchema>);
      }
      return createCategory(payload as z.infer<typeof formSchema>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      console.error("Erro ao salvar categoria:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSend = { ...values } as z.infer<typeof formSchema> & { id?: number };
    if (isEditing && category) {
      dataToSend.id = category.id;
    }
    mutation.mutate(dataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
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
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
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