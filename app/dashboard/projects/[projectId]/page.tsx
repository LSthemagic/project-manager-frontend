'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, Task, TaskStatus } from '@/lib/types';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { KanbanColumn } from './_components/KanbanColumn';
import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { TaskDetailsModal } from './_components/TaskDetailsModal';
import { ProjectForm } from '../../_components/ProjectForm';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MoreHorizontal } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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

const deleteProject = (projectId: string) => {
  return api.delete(`/projects/${projectId}`);
};

type ProjectBoardPageProps = {
  params: {
    projectId: string;
  };
};

export default function ProjectBoardPage({ params }: ProjectBoardPageProps) {
  const { projectId } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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

  const taskMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      router.push('/dashboard');
    },
    onError: (error) => {
      console.error("Erro ao deletar projeto:", error);
      // Adicionar toast de erro aqui no futuro
    }
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
        taskMutation.mutate({ taskId: taskId, status_id: newStatusId });
      }
    }
  };
  
  const isLoading = isLoadingProject || isLoadingStatuses || isLoadingTasks;

  if (isLoading) return <div>Carregando board...</div>;
  if (!project || !statuses || !tasks) return <div>Não foi possível carregar os dados.</div>;

  const canManageProject = user?.tipo_usuario === 'admin' || user?.tipo_usuario === 'gerente';

  return (
    <>
      <ProjectForm
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        project={project}
      />
      <TaskDetailsModal
        taskId={selectedTaskId}
        onOpenChange={() => setSelectedTaskId(null)}
      />
      <div className="flex flex-col h-full">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.nome}</h1>
            <p className="text-muted-foreground">{project.descricao}</p>
          </div>
          {canManageProject && (
            <AlertDialog>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                      Editar Projeto
                    </DropdownMenuItem>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem className="text-red-600">
                        Excluir Projeto
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá deletar permanentemente o projeto e todas as suas tarefas.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProjectMutation.mutate(projectId)}>
                        Sim, excluir projeto
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          )}
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