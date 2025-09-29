'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Task } from '@/lib/types';

type TaskCardProps = {
  task: Task;
  onClick: () => void;
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task?.id || 0,
    disabled: !task || !task.id || task.id <= 0,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
  };
  
  // Verificar se o task tem um ID válido após os hooks
  if (!task || !task.id || task.id <= 0) {
    console.warn("TaskCard recebeu task inválido:", task);
    return (
      <Card className="opacity-50 border-red-200">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-red-500">Tarefa inválida</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        onClick={onClick}
        className="hover:shadow-lg transition-shadow cursor-pointer"
      >
        <CardHeader className="p-4">
          <CardTitle className="text-base">{task.titulo}</CardTitle>
        </CardHeader>
        {task.descricao && (
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {task.descricao}
            </p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}