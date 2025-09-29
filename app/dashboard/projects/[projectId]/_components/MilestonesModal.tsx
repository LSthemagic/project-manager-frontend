'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Milestone } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Edit, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { MilestoneForm } from './MilestoneForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type MilestonesModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  projectId: number;
};

const fetchMilestones = async (projectId: number): Promise<Milestone[]> => {
    const { data } = await api.get(`/projects/${projectId}/milestones`);
    return data;
};

const toggleMilestoneStatus = async (milestone: Milestone) => {
    return api.put(`/milestones/${milestone.id}`, { concluido: !milestone.concluido });
}

const deleteMilestone = async (milestoneId: number) => {
    return api.delete(`/milestones/${milestoneId}`);
}

export function MilestonesModal({ isOpen, onOpenChange, projectId }: MilestonesModalProps) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const { data: milestones = [], isLoading } = useQuery<Milestone[]>({
    queryKey: ['milestones', projectId],
    queryFn: () => fetchMilestones(projectId),
    enabled: !!projectId,
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones', projectId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ocorreu um erro.");
    }
  };

  const toggleMutation = useMutation({ ...mutationOptions, mutationFn: toggleMilestoneStatus });
  const deleteMutation = useMutation({ ...mutationOptions, mutationFn: deleteMilestone });

  const handleEdit = (milestone: Milestone) => {
      setSelectedMilestone(milestone);
      setIsFormOpen(true);
  }

  const handleAddNew = () => {
      setSelectedMilestone(null);
      setIsFormOpen(true);
  }

  return (
    <>
        <MilestoneForm 
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            projectId={projectId}
            milestone={selectedMilestone}
        />
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
            <DialogTitle>Marcos do Projeto (Milestones)</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
                <Button onClick={handleAddNew} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Marco
                </Button>

                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
                    {isLoading && <p>Carregando...</p>}
                    {milestones.map(milestone => (
                        <div key={milestone.id} className="flex items-start gap-4">
                           <button onClick={() => toggleMutation.mutate(milestone)}>
                            {milestone.concluido ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                           </button>
                           <div className="flex-1">
                                <p className={cn("font-semibold", milestone.concluido && "line-through text-muted-foreground")}>{milestone.nome}</p>
                                <p className="text-sm text-muted-foreground">{milestone.descricao}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Meta: {format(new Date(milestone.data_meta), "PPP", { locale: ptBR })}
                                </p>
                           </div>
                           <div className="flex items-center">
                               <Button variant="ghost" size="icon" onClick={() => handleEdit(milestone)}>
                                   <Edit className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(milestone.id)}>
                                   <Trash2 className="h-4 w-4 text-destructive" />
                               </Button>
                           </div>
                        </div>
                    ))}
                    {milestones.length === 0 && !isLoading && <p className="text-center text-muted-foreground py-8">Nenhum marco definido para este projeto.</p>}
                </div>
            </div>
        </DialogContent>
        </Dialog>
    </>
  );
}