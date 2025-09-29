'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User, TeamMember, Project } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Crown, Trash2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

type TeamManagementModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  project: Project;
};

const fetchAllUsers = async (): Promise<User[]> => {
    const { data } = await api.get('/users');
    return data;
}

const fetchProjectMembers = async (teamId: number): Promise<TeamMember[]> => {
  const { data } = await api.get(`/teams/${teamId}/members`);
  return data;
};

// CORREÇÃO APLICADA AQUI: O corpo da requisição agora envia `userId` e `papel`.
const addMemberToTeam = ({ teamId, userId }: { teamId: number, userId: number }) => {
    return api.post(`/teams/${teamId}/members`, { userId: userId, papel: 'membro' });
}

const removeMemberFromTeam = ({ teamId, userId }: { teamId: number, userId: number }) => {
    return api.delete(`/teams/${teamId}/members/${userId}`);
}

const updateTeamLeader = ({ teamId, lider_id }: { teamId: number, lider_id: number }) => {
    return api.put(`/teams/${teamId}`, { lider_id });
}

export function TeamManagementModal({ isOpen, onOpenChange, project }: TeamManagementModalProps) {
  const queryClient = useQueryClient();
  const [openAddMember, setOpenAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: members = [], isLoading: isLoadingMembers } = useQuery<TeamMember[]>({
    queryKey: ['projectMembers', project.team_id],
    queryFn: () => fetchProjectMembers(project.team_id!),
    enabled: !!project.team_id,
  });
  
  const { data: allUsers = [] } = useQuery<User[]>({
      queryKey: ['allUsers'],
      queryFn: fetchAllUsers
  });

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectMembers', project.team_id] });
      queryClient.invalidateQueries({ queryKey: ['project', String(project.id)] });
      queryClient.invalidateQueries({ queryKey: ['projectMembers', project.id] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Ocorreu um erro.");
    }
  };

  const addMemberMutation = useMutation({ ...mutationOptions, mutationFn: addMemberToTeam, onSuccess: (...args) => {
    mutationOptions.onSuccess(...args);
    toast.success("Membro adicionado com sucesso!");
    setOpenAddMember(false);
    setSearchTerm('');
  }});
  const removeMemberMutation = useMutation({ ...mutationOptions, mutationFn: removeMemberFromTeam, onSuccess: (...args) => {
      mutationOptions.onSuccess(...args);
      toast.success("Membro removido com sucesso!");
  }});
  const updateLeaderMutation = useMutation({ ...mutationOptions, mutationFn: updateTeamLeader, onSuccess: (...args) => {
      mutationOptions.onSuccess(...args);
      toast.success("Líder do projeto atualizado!");
  }});


  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).join('').toUpperCase();
  
  const memberIds = new Set(members.map(m => m.id));
  const availableUsers = allUsers
    .filter(u => !memberIds.has(u.id))
    .filter(u => u.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddMember = (userId: number) => {
    if (!project.team_id) {
        toast.error("ID da equipe não encontrado. Recarregue a página.");
        return;
    }
    addMemberMutation.mutate({ teamId: project.team_id, userId: userId });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Gerenciar Equipe do Projeto</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Membros Atuais</h3>
                <Popover open={openAddMember} onOpenChange={setOpenAddMember}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Adicionar
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-1 w-[300px]" side="bottom" align="end">
                         <div className="flex flex-col space-y-1">
                            <Input 
                                placeholder="Buscar usuário..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                                className="mb-2"
                            />
                            <div className="max-h-48 overflow-y-auto">
                                {availableUsers.length > 0 ? availableUsers.map(user => (
                                    <Button
                                        key={user.id}
                                        variant="ghost"
                                        className="w-full justify-start font-normal"
                                        onClick={() => handleAddMember(user.id)}
                                    >
                                      {user.nome}
                                    </Button>
                                )) : <p className="p-2 text-center text-sm text-muted-foreground">Nenhum usuário encontrado.</p>}
                            </div>
                         </div>
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {isLoadingMembers ? <p>Carregando membros...</p> : members.map(member => (
                    <div key={member.id} className="flex items-center justify-between p-2 rounded-md border">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>{getInitials(member.nome)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-medium">{member.nome}</p>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            {project.lider_id === member.id ? (
                                <Badge variant="secondary"><Crown className="mr-1 h-3 w-3" /> Líder</Badge>
                            ) : (
                                <Button title="Tornar líder" variant="ghost" size="icon" onClick={() => updateLeaderMutation.mutate({teamId: project.team_id!, lider_id: member.id})}>
                                    <Crown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            )}
                            
                            {project.lider_id !== member.id && (
                                <Button title="Remover do projeto" variant="ghost" size="icon" onClick={() => removeMemberMutation.mutate({ teamId: project.team_id!, userId: member.id })}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
