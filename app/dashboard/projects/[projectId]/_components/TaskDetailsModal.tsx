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
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{task?.titulo || 'Carregando tarefa...'}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div>Carregando...</div>
        ) : task && (
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="tags">Etiquetas</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
              <TabsTrigger value="subtasks">Sub-tarefas</TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
              <TabsTrigger value="timelogs">Horas</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <TaskDetailsForm task={task} />
            </TabsContent>
            <TabsContent value="tags">
                <TagsTab taskId={task.id} />
            </TabsContent>
            <TabsContent value="comments">
              <CommentsTab taskId={task.id} />
            </TabsContent>
            <TabsContent value="subtasks">
              <SubtasksTab taskId={task.id} />
            </TabsContent>
            <TabsContent value="attachments">
              <AttachmentsTab taskId={task.id} />
            </TabsContent>
            <TabsContent value="timelogs">
                <TimeLogTab taskId={task.id} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}