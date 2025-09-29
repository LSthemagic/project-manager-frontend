'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task, User } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

const formSchema = z.object({
  titulo: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional().nullable(),
  prioridade: z.enum(['baixa', 'media', 'alta']),
  responsavel_id: z.coerce.number().optional().nullable(),
  data_inicio: z.date().optional().nullable(),
  data_fim: z.date().optional().nullable(),
  estimativa_horas: z.coerce.number().optional().nullable(),
});

type TaskDetailsFormProps = {
  task: Task;
};

const fetchProjectMembers = async (projectId: number): Promise<User[]> => {
    const { data } = await api.get(`/projects/${projectId}/members`);
    return data;
};

const updateTask = ({ id, ...data }: { id: number } & z.infer<typeof formSchema>) => {
    return api.put(`/tasks/${id}`, data);
};

export function TaskDetailsForm({ task }: TaskDetailsFormProps) {
  const queryClient = useQueryClient();

  const { data: members, isLoading: isLoadingMembers } = useQuery<User[]>({
    queryKey: ['projectMembers', task.projeto_id],
    queryFn: () => fetchProjectMembers(task.projeto_id),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        titulo: task.titulo || '',
        descricao: task.descricao || '',
        prioridade: task.prioridade || 'media',
        responsavel_id: task.responsavel_id || null,
        data_inicio: task.data_inicio ? new Date(task.data_inicio) : null,
        data_fim: task.data_fim ? new Date(task.data_fim) : null,
        estimativa_horas: task.estimativa_horas || 0,
    },
  });

  useEffect(() => {
    form.reset({
        titulo: task.titulo,
        descricao: task.descricao,
        prioridade: task.prioridade,
        responsavel_id: task.responsavel_id,
        data_inicio: task.data_inicio ? new Date(task.data_inicio) : null,
        data_fim: task.data_fim ? new Date(task.data_fim) : null,
        estimativa_horas: task.estimativa_horas,
    });
  }, [task, form]);

  const mutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success('Tarefa atualizada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['tasks', task.projeto_id] });
      queryClient.invalidateQueries({ queryKey: ['task', task.id] });
    },
    onError: (error) => {
      toast.error('Erro ao atualizar a tarefa.');
      console.error("Erro ao salvar tarefa:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutation.mutate({ id: task.id, ...values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              {/* CORREÇÃO APLICADA AQUI */}
              <FormControl><Input {...field} value={field.value ?? ''} /></FormControl>
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
              {/* CORREÇÃO APLICADA AQUI */}
              <FormControl><Textarea {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="responsavel_id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value ?? '')} disabled={isLoadingMembers}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Ninguém atribuído" /></SelectTrigger></FormControl>
                        <SelectContent>
                        <SelectItem value="0">Ninguém atribuído</SelectItem>
                        {members?.map((member) => (
                            <SelectItem key={member.id} value={String(member.id)}>{member.nome}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
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
        </div>
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="data_inicio"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data de Início</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
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
                            <Button variant="outline" className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Escolha uma data</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormField
            control={form.control}
            name="estimativa_horas"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Estimativa de Horas</FormLabel>
                {/* CORREÇÃO APLICADA AQUI */}
                <FormControl><Input type="number" {...field} value={field.value ?? ''} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Salvar Alterações
        </Button>
      </form>
    </Form>
  );
}