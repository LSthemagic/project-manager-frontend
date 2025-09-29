'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project, Task, TaskStatus } from '@/lib/types';
import { DndContext, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { KanbanColumn } from './_components/KanbanColumn';
import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TaskDetailsModal } from './_components/TaskDetailsModal';
import { ProjectForm } from '../../_components/ProjectForm';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Award, Check, Loader2, MoreHorizontal, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { TaskForm } from './_components/TaskForm';
import { Skeleton } from '@/components/ui/skeleton';
import { TeamManagementModal } from './_components/TeamManagementModal';
import { MilestonesModal } from './_components/MilestonesModal';
import { toast } from 'sonner';

const fetchProjectDetails = async (projectId: string): Promise<Project> => {
  const { data } = await api.get(`/projects/${projectId}`);
  return data;
};

const fetchTaskStatuses = async (): Promise<TaskStatus[]> => {
  const { data } = await api.get("/task-statuses");
  return data;
};

const fetchTasksForProject = async (projectId: string): Promise<Task[]> => {
  const { data } = await api.get(`/projects/${projectId}/tasks`);
  return data;
};

const finishProject = (projectId: string) => {
  return api.post(`/projects/${projectId}/finish`);
};

const updateTaskStatus = async ({ taskId, status_id }: { taskId: number; status_id: number; }) => {
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
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState<number | null>(null);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isMilestonesModalOpen, setIsMilestonesModalOpen] = useState(false);

  const {
    data: project,
    isLoading: isLoadingProject,
    isError: isErrorProject,
  } = useQuery<Project>({
    queryKey: ["project", projectId],
    queryFn: () => fetchProjectDetails(projectId),
  });

  const { data: statuses, isLoading: isLoadingStatuses } = useQuery<
    TaskStatus[]
  >({
    queryKey: ["taskStatuses"],
    queryFn: fetchTaskStatuses,
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery<Task[]>({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasksForProject(projectId),
  });

  const taskMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Projeto excluído com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error("Erro ao excluir projeto.");
      console.error("Erro ao deletar projeto:", error);
    },
  });

  const finishProjectMutation = useMutation({
    mutationFn: finishProject,
    onSuccess: () => {
      toast.success("Projeto finalizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Não foi possível finalizar o projeto."
      );
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
      const task = tasks?.find((t) => t.id === taskId);
      if (task && task.status_id !== newStatusId) {
        taskMutation.mutate({ taskId: taskId, status_id: newStatusId });
      }
    }
  };

  const handleAddTask = (statusId: number) => {
    setSelectedStatusId(statusId);
    setIsTaskFormOpen(true);
  };

  const isLoading = isLoadingProject || isLoadingStatuses || isLoadingTasks;
  const canManageProject =
    user?.tipo_usuario === "admin" || user?.tipo_usuario === "gerente";

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <Skeleton className="h-9 w-1/2" />
          <Skeleton className="h-4 w-3/4 mt-2" />
        </div>
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="grid grid-flow-col auto-cols-[320px] gap-4 h-full">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-muted rounded-lg p-4 flex flex-col"
              >
                <Skeleton className="h-6 w-1/3 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isErrorProject || !project || !statuses || !tasks)
    return <div>Não foi possível carregar os dados do projeto.</div>;

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
      <MilestonesModal
        isOpen={isMilestonesModalOpen}
        onOpenChange={setIsMilestonesModalOpen}
        projectId={project.id}
      />
      {selectedStatusId && (
        <TaskForm
          isOpen={isTaskFormOpen}
          onOpenChange={setIsTaskFormOpen}
          projectId={projectId}
          statusId={selectedStatusId}
        />
      )}
      {project.team_id && (
        <TeamManagementModal
          isOpen={isTeamModalOpen}
          onOpenChange={setIsTeamModalOpen}
          project={project}
        />
      )}
      <div className="flex flex-col h-full">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{project.nome}</h1>
            <p className="text-muted-foreground">{project.descricao}</p>
          </div>
          <div className="flex items-center gap-2">
            {canManageProject && (
              <Button
                variant="outline"
                onClick={() => setIsTeamModalOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Equipe
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsMilestonesModalOpen(true)}
            >
              <Award className="mr-2 h-4 w-4" />
              Marcos
            </Button>
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
                    <DropdownMenuItem
                      onClick={() => finishProjectMutation.mutate(projectId)}
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Finalizar Projeto
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
                    <AlertDialogTitle>
                      Você tem certeza absoluta?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Essa ação não pode ser desfeita. Isso irá deletar
                      permanentemente o projeto e todas as suas tarefas.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleteProjectMutation.isPending}
                      onClick={() => deleteProjectMutation.mutate(projectId)}
                    >
                      {deleteProjectMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Sim, excluir projeto
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <div className="flex-1 overflow-x-auto pb-4">
            <div className="grid grid-flow-col auto-cols-[320px] gap-4 h-full">
              {statuses?.map((status) => (
                <KanbanColumn
                  key={status.id}
                  status={status}
                  tasks={tasks.filter((task) => task.status_id === status.id)}
                  onTaskClick={(taskId) => setSelectedTaskId(taskId)}
                  onAddTaskClick={handleAddTask}
                />
              ))}
            </div>
          </div>
        </DndContext>
      </div>
    </>
  );
}
