import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
  onAddTaskClick: (statusId: number) => void;
};

export function KanbanColumn({ status, tasks, onTaskClick, onAddTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status.id,
  });

  return (
    <div ref={setNodeRef} className="bg-muted rounded-lg p-4 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">{status.nome}</h2>
        <Button variant="ghost" size="icon" onClick={() => onAddTaskClick(status.id)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-4 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)}
          />
        ))}
         {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-4">
            Nenhuma tarefa nesta coluna.
          </div>
        )}
      </div>
    </div>
  );
}