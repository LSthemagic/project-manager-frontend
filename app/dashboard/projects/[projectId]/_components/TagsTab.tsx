'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Etiqueta } from '@/lib/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';

const fetchAllTags = async (): Promise<Etiqueta[]> => {
    const { data } = await api.get('/admin/tags');
    return data;
};

const fetchTaskTags = async (taskId: number): Promise<Etiqueta[]> => {
    const { data } = await api.get(`/tasks/${taskId}/tags`);
    return data;
};

const addTagToTask = async ({ taskId, tagId }: { taskId: number, tagId: number }) => {
    return api.post(`/tasks/${taskId}/tags`, { etiqueta_id: tagId });
};

const removeTagFromTask = async ({ taskId, tagId }: { taskId: number, tagId: number }) => {
    return api.delete(`/tasks/${taskId}/tags/${tagId}`);
};

type TagsTabProps = {
    taskId: number;
};

export function TagsTab({ taskId }: TagsTabProps) {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: allTags = [] } = useQuery<Etiqueta[]>({
        queryKey: ['tags'],
        queryFn: fetchAllTags,
    });

    const { data: taskTags = [], isLoading } = useQuery<Etiqueta[]>({
        queryKey: ['taskTags', taskId],
        queryFn: () => fetchTaskTags(taskId),
    });

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['taskTags', taskId] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Ocorreu um erro.");
        }
    };

    const addMutation = useMutation({ ...mutationOptions, mutationFn: addTagToTask });
    const removeMutation = useMutation({ ...mutationOptions, mutationFn: removeTagFromTask });

    const taskTagIds = new Set(taskTags.map(t => t.id));
    
    const availableTags = allTags
        .filter(t => !taskTagIds.has(t.id))
        .filter(t => t.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isLoading) return <p>Carregando etiquetas...</p>;

    return (
        <div className="space-y-4 py-4">
            <div className="flex flex-wrap gap-2">
                {taskTags.map(tag => (
                    <Badge key={tag.id} style={{ backgroundColor: tag.cor, color: 'white' }} className="cursor-pointer">
                        {tag.nome}
                        <button onClick={() => removeMutation.mutate({ taskId, tagId: tag.id })} className="ml-2 rounded-full hover:bg-black/20 p-0.5">
                            <X size={12} />
                        </button>
                    </Badge>
                ))}
                 {taskTags.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma etiqueta associada.</p>}
            </div>
            
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                        Adicionar etiqueta...
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-1 w-[--radix-popover-trigger-width]" side="bottom" align="start">
                    <div className="flex flex-col space-y-1">
                        <Input
                            placeholder="Buscar etiquetas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mb-1"
                        />
                        <div className="max-h-48 overflow-y-auto">
                            {availableTags.length > 0 ? availableTags.map(tag => (
                                <Button
                                    key={tag.id}
                                    variant="ghost"
                                    className="w-full justify-start font-normal h-8 px-2"
                                    onClick={() => {
                                        addMutation.mutate({ taskId, tagId: tag.id });
                                        setOpen(false);
                                        setSearchTerm('');
                                    }}
                                >
                                   <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: tag.cor }} />
                                   {tag.nome}
                                </Button>
                            )) : <p className="p-2 text-center text-sm text-muted-foreground">Nenhuma etiqueta encontrada.</p>}
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}