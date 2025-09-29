'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Milestone } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const formSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  descricao: z.string().optional(),
  data_meta: z.date({ required_error: 'A data meta é obrigatória.' }),
});

type MilestoneFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: number;
  milestone?: Milestone | null;
};

const createMilestone = (data: { projeto_id: number } & z.infer<typeof formSchema>) => api.post(`/projects/${data.projeto_id}/milestones`, data);
const updateMilestone = ({ id, ...data }: { id: number } & z.infer<typeof formSchema>) => api.put(`/milestones/${id}`, data);

export function MilestoneForm({ isOpen, onOpenChange, projectId, milestone }: MilestoneFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!milestone;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (milestone) {
      form.reset({
        nome: milestone.nome,
        descricao: milestone.descricao || '',
        data_meta: new Date(milestone.data_meta),
      });
    } else {
      form.reset({
        nome: '',
        descricao: '',
        data_meta: undefined,
      });
    }
  }, [milestone, form]);

  const mutation = useMutation({
    mutationFn: isEditing ? updateMilestone : createMilestone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
      toast.success(`Marco ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error("Ocorreu um erro ao salvar o marco.");
      console.error("Erro ao salvar o marco:", error);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSend = { ...values, id: milestone?.id, projeto_id: projectId };
    mutation.mutate(dataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Marco' : 'Novo Marco (Milestone)'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Marco</FormLabel>
                  <FormControl><Input placeholder="Ex: Lançamento da v1.0" {...field} /></FormControl>
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
                  <FormControl><Textarea placeholder="Descreva o objetivo deste marco." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
                control={form.control}
                name="data_meta"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Data Meta</FormLabel>
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
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}