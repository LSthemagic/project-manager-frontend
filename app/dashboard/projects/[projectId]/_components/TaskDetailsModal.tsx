'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommentsTab } from './CommentsTab';
import { SubtasksTab } from './SubtasksTab';
import { AttachmentsTab } from './AttachmentsTab';

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
            <TabsList>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="comments">Comentários</TabsTrigger>
              <TabsTrigger value="subtasks">Sub-tarefas</TabsTrigger>
              <TabsTrigger value="attachments">Anexos</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <div className="space-y-4 py-4">
                <p>{task.descricao || 'Esta tarefa não possui descrição.'}</p>
                <div><strong>Prioridade:</strong> {task.prioridade}</div>
              </div>
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
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}