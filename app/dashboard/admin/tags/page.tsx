'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Etiqueta } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { TagForm } from './TagForm';
import { toast } from 'sonner';

const fetchTags = async (): Promise<Etiqueta[]> => {
  const { data } = await api.get('/admin/tags');
  return data;
};

const deleteTag = (tagId: number) => api.delete(`/admin/tags/${tagId}`);

export default function TagsAdminPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Etiqueta | null>(null);
  const queryClient = useQueryClient();

  const { data: tags, isLoading, isError } = useQuery<Etiqueta[]>({
    queryKey: ['tags'],
    queryFn: fetchTags,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success('Etiqueta excluída com sucesso!');
    },
    onError: () => {
        toast.error("Não é possível excluir etiquetas que já estão em uso.");
    }
  });

  const handleAddNew = () => {
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tag: Etiqueta) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const handleDelete = (tagId: number) => {
    toast("Tem certeza que deseja excluir esta etiqueta?", {
        action: { label: "Excluir", onClick: () => deleteMutation.mutate(tagId) },
        cancel: { label: "Cancelar" }
    });
  };

  if (isLoading) return <div>Carregando etiquetas...</div>;
  if (isError) return <div>Ocorreu um erro ao buscar as etiquetas.</div>;

  return (
    <>
      <TagForm
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        etiqueta={selectedTag}
      />
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gerenciamento de Etiquetas (Tags)</h1>
          <Button onClick={handleAddNew}>Adicionar Etiqueta</Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cor</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags?.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.cor }} />
                        {tag.cor}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{tag.nome}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(tag)}>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(tag.id)}>Deletar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}