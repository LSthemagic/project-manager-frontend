import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '@/lib/types';
import { TaskCard } from './TaskCard';

type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: number) => void;
};

export function KanbanColumn({ status, tasks, onTaskClick }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: status.id,
  });

  return (
    <div ref={setNodeRef} className="bg-muted rounded-lg p-4 flex flex-col">
      <h2 className="font-bold mb-4">{status.nome}</h2>
      <div className="space-y-4 flex-1">
        {tasks.map((task) => (
          <TaskCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)}
          />
        ))}
      </div>
    </div>
  );
}