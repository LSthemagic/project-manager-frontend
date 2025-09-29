'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, Task, TaskStatus } from '@/lib/types';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { KanbanColumn } from './_components/KanbanColumn';
import { useState, use } from 'react';
import { TaskDetailsModal } from './_components/TaskDetailsModal';

const fetchProjectDetails = async (projectId: string): Promise<Project> => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

const fetchTaskStatuses = async (): Promise<TaskStatus[]> => {
  const { data } = await api.get('/task-statuses');
  return data;
};

const fetchTasksForProject = async (projectId: string): Promise<Task[]> => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

const updateTaskStatus = async ({ taskId, status_id }: { taskId: number, status_id: number }) => {
  const { data } = await api.put(`/tasks/${taskId}`, { status_id });
  return data;
};

type ProjectBoardPageProps = {
  params: {
    projectId: string;
  };
};

export default function ProjectBoardPage({ params }: ProjectBoardPageProps) {
  const { projectId } = use(params);
  const queryClient = useQueryClient();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { data: project, isLoading: isLoadingProject } = useQuery<Project>({
    queryKey: ['project', projectId],
    queryFn: () => fetchProjectDetails(projectId),
  });

  const { data: statuses, isLoading: isLoadingStatuses } = useQuery<TaskStatus[]>({
    queryKey: ['taskStatuses'],
    queryFn: fetchTaskStatuses,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasksForProject(projectId),
  });

  const mutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const taskId = Number(active.id);
      const newStatusId = Number(over.id);
      const task = tasks?.find(t => t.id === taskId);
      if (task && task.status_id !== newStatusId) {
        mutation.mutate({ taskId: taskId, status_id: newStatusId });
      }
    }
  };
  
  const isLoading = isLoadingProject || isLoadingStatuses || isLoadingTasks;

  if (isLoading) return <div>Carregando board...</div>;
  if (!project || !statuses || !tasks) return <div>Não foi possível carregar os dados.</div>;

  return (
    <>
      <TaskDetailsModal
        taskId={selectedTaskId}
        onOpenChange={() => setSelectedTaskId(null)}
      />
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">{project.nome}</h1>
          <p className="text-muted-foreground">{project.descricao}</p>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto">
            <div className="grid grid-flow-col auto-cols-[300px] gap-4 h-full">
              {statuses?.map((status) => (
                <KanbanColumn
                  key={status.id}
                  status={status}
                  tasks={tasks.filter((task) => task.status_id === status.id)}
                  onTaskClick={(taskId) => setSelectedTaskId(taskId)}
                />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </>
  );
}