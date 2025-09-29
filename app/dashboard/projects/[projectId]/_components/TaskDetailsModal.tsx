'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentsTab } from './CommentsTab';
import { SubtasksTab } from './SubtasksTab';
import { AttachmentsTab } from './AttachmentsTab';
import { TimeLogTab } from './TimeLogTab';
import { TaskDetailsForm } from './TaskDetailsForm';
import { TagsTab } from './TagsTab'; // Importar

const fetchTaskDetails = async (taskId: number): Promise<Task> => {
  const { data } = await api.get(`/tasks/${taskId}`);
  return data;
};

type TaskDetailsModalProps = {
  taskId: number | null;
  onOpenChange: (open: boolean) => void;
};

export function TaskDetailsModal({ taskId, onOpenChange }: TaskDetailsModalProps) {
  const { data: task, isLoading } = useQuery<Task>({
    queryKey: ['task', taskId],
    queryFn: () => fetchTaskDetails(taskId!),
    enabled: !!taskId,
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={!!taskId} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[625px] w-full max-w-[98vw] p-2 sm:p-8">
        <DialogHeader>
          <DialogTitle className="truncate">{task?.titulo || 'Carregando tarefa...'}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">Carregando...</div>
        ) : task && (
          <Tabs defaultValue="details" className="mt-4">
        <TabsList className="grid w-full h-full grid-cols-2 sm:grid-cols-6 gap-2">
          <TabsTrigger value="details" className="truncate">Detalhes</TabsTrigger>
          <TabsTrigger value="tags" className="truncate">Etiquetas</TabsTrigger>
          <TabsTrigger value="comments" className="truncate">Comentários</TabsTrigger>
          <TabsTrigger value="subtasks" className="truncate">Sub-tarefas</TabsTrigger>
          <TabsTrigger value="attachments" className="truncate">Anexos</TabsTrigger>
          <TabsTrigger value="timelogs" className="truncate">Horas</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-2">
          <TaskDetailsForm task={task} />
        </TabsContent>
        <TabsContent value="tags" className="pt-2">
          <TagsTab taskId={task.id} />
        </TabsContent>
        <TabsContent value="comments" className="pt-2">
          <CommentsTab taskId={task.id} />
        </TabsContent>
        <TabsContent value="subtasks" className="pt-2">
          <SubtasksTab taskId={task.id} />
        </TabsContent>
        <TabsContent value="attachments" className="pt-2">
          <AttachmentsTab taskId={task.id} />
        </TabsContent>
        <TabsContent value="timelogs" className="pt-2">
          <TimeLogTab taskId={task.id} />
        </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}