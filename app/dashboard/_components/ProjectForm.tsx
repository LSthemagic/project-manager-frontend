'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Category, Project } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional(),
  categoria_id: z.string().min(1, { message: 'Selecione uma categoria.' }),
});

type ProjectFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project?: Project | null;
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

const createProject = (data: Omit<z.infer<typeof formSchema>, 'categoria_id'> & { categoria_id: number }) => api.post('/projects', data);
const updateProject = ({ id, ...data }: { id: number } & Omit<z.infer<typeof formSchema>, 'categoria_id'> & { categoria_id: number }) => api.put(`/projects/${id}`, data);

export function ProjectForm({ isOpen, onOpenChange, project }: ProjectFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!project;

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nome: '', descricao: '', categoria_id: '' },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        nome: project.nome,
        descricao: project.descricao || '',
        categoria_id: String(project.categoria_id),
      });
    } else {
      form.reset({ nome: '', descricao: '', categoria_id: '' });
    }
  }, [project, form]);

  const mutation = useMutation({
    mutationFn: isEditing ? updateProject : createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Erro ao salvar projeto:", error);
      // Futuramente, substituir por um toast de erro
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({ ...values, id: project?.id, categoria_id: Number(values.categoria_id) });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Projeto' : 'Criar Novo Projeto'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Projeto</FormLabel>
                  <FormControl><Input placeholder="Ex: Lançamento do App" {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="Descreva o objetivo principal do projeto" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoria_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCategories}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Selecione a categoria..." /></SelectTrigger></FormControl>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>{cat.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : 'Salvar Projeto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}