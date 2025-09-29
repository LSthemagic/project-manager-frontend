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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional(),
  categoria_id: z.string().min(1, { message: 'Selecione uma categoria.' }),
  status: z.enum(['planejamento', 'em_andamento', 'concluido', 'cancelado']),
  prioridade: z.enum(['baixa', 'media', 'alta']),
  data_inicio: z.date().optional().nullable(),
  data_fim: z.date().optional().nullable(),
  orcamento: z.union([z.number(), z.null(), z.undefined()]).optional(),
});

type FormData = z.infer<typeof formSchema>;

type ProjectFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project?: Project | null;
};

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await api.get('/categories');
  return data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createProject = (data: any) => api.post('/projects', data);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateProject = (data: any) => api.put(`/projects/${data.id}`, data);

export function ProjectForm({ isOpen, onOpenChange, project }: ProjectFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!(project && project.id > 0);

  const { data: categories, isLoading: isLoadingCategories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      descricao: '',
      categoria_id: '',
      status: 'planejamento',
      prioridade: 'media',
      data_inicio: null,
      data_fim: null,
      orcamento: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
        if (project) {
        form.reset({
            nome: project.nome,
            descricao: project.descricao || '',
            categoria_id: String(project.categoria_id),
            status: project.status,
            prioridade: project.prioridade,
            data_inicio: project.data_inicio ? new Date(project.data_inicio) : null,
            data_fim: project.data_fim ? new Date(project.data_fim) : null,
            orcamento: project.orcamento || 0,
        });
        } else {
        form.reset({
            nome: '',
            descricao: '',
            categoria_id: '',
            status: 'planejamento',
            prioridade: 'media',
            data_inicio: null,
            data_fim: null,
            orcamento: 0,
        });
        }
    }
  }, [project, form, isOpen]);

  const mutation = useMutation({
    mutationFn: isEditing ? updateProject : createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      if(isEditing) {
        queryClient.invalidateQueries({ queryKey: ['project', project?.id] });
      }
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Erro ao salvar projeto:", error);
    },
  });

  const onSubmit = (values: FormData) => {
    const projectData = { 
        ...values, 
        categoria_id: Number(values.categoria_id),
        ...(project?.id && { id: project.id })
    };
    
    if (isEditing && project?.id) {
      mutation.mutate({ ...projectData, id: project.id });
    } else {
      mutation.mutate(projectData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="categoria_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCategories}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
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
                <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="planejamento">Planejamento</SelectItem>
                            <SelectItem value="em_andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluido">Concluído</SelectItem>
                            <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl>
                        <SelectContent>
                            <SelectItem value="baixa">Baixa</SelectItem>
                            <SelectItem value="media">Média</SelectItem>
                            <SelectItem value="alta">Alta</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="orcamento"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Orçamento (R$)</FormLabel>
                    <FormControl>
                        <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0,00" 
                            {...field}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="data_inicio"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de Início</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Escolha uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="data_fim"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data Final</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(field.value, "PPP")
                                            ) : (
                                                <span>Escolha uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        selected={field.value || undefined}
                                        onSelect={field.onChange}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? 'Salvando...' : 'Salvar Projeto'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}