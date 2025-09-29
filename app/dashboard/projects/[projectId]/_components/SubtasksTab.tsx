'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Subtask } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

const fetchSubtasks = async (taskId: number): Promise<Subtask[]> => {
  const { data } = await api.get(`/tasks/${taskId}/subtasks`);
  return data;
};

const addSubtask = async ({ taskId, titulo }: { taskId: number; titulo: string }) => {
  const { data } = await api.post(`/tasks/${taskId}/subtasks`, { titulo });
  return data;
};

const updateSubtask = async ({ subtaskId, concluida }: { subtaskId: number; concluida: boolean }) => {
  const { data } = await api.put(`/subtasks/${subtaskId}`, { concluida });
  return data;
};

const deleteSubtask = async (subtaskId: number) => {
  await api.delete(`/subtasks/${subtaskId}`);
};

const subtaskSchema = z.object({
  titulo: z.string().min(1, { message: 'A sub-tarefa não pode estar vazia.' }),
});

type SubtasksTabProps = {
  taskId: number;
};

export function SubtasksTab({ taskId }: SubtasksTabProps) {
  const queryClient = useQueryClient();

  const { data: subtasks, isLoading } = useQuery<Subtask[]>({
    queryKey: ['subtasks', taskId],
    queryFn: () => fetchSubtasks(taskId),
  });

  // Log para diagnóstico no console do navegador
  console.log('Dados recebidos para sub-tarefas:', subtasks);

  const addMutation = useMutation({
    mutationFn: addSubtask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
      form.reset();
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateSubtask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSubtask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subtasks', taskId] });
    },
  });

  const form = useForm<z.infer<typeof subtaskSchema>>({
    resolver: zodResolver(subtaskSchema),
    defaultValues: { titulo: '' },
  });

  const onSubmit = (values: z.infer<typeof subtaskSchema>) => {
    addMutation.mutate({ taskId, titulo: values.titulo });
  };

  return (
    <div className="space-y-4 py-4">
      <div className="space-y-2 max-h-60 overflow-y-auto pr-4">
        {isLoading && <p>Carregando sub-tarefas...</p>}
        {/* --- CORREÇÃO APLICADA AQUI --- */}
        {/* Verificamos explicitamente se 'subtasks' é um array antes de usar .map() */}
        {Array.isArray(subtasks) && subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center gap-2">
            <Checkbox
              id={`subtask-${subtask.id}`}
              checked={subtask.concluida}
              onCheckedChange={(checked) => {
                updateMutation.mutate({ subtaskId: subtask.id, concluida: !!checked });
              }}
            />
            <label
              htmlFor={`subtask-${subtask.id}`}
              className={`flex-1 text-sm ${subtask.concluida ? 'line-through text-muted-foreground' : ''}`}
            >
              {subtask.titulo}
            </label>
            <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(subtask.id)}>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
        ))}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="titulo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input placeholder="Adicionar nova sub-tarefa..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={addMutation.isPending}>Adicionar</Button>
        </form>
      </Form>
    </div>
  );
}
