'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectForm } from './_components/ProjectForm';
import { Skeleton } from '@/components/ui/skeleton';

const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get('/projects');
  return data;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const handleCreateProjectClick = () => {
    setIsModalOpen(true);
  };

  if (isError) return <div>Ocorreu um erro ao buscar os projetos.</div>;

  return (
    <>
      <ProjectForm isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meus Projetos</h1>
          {user?.tipo_usuario !== 'comum' && (
            <Button onClick={handleCreateProjectClick}>Criar Novo Projeto</Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-[150px] rounded-lg" />
            <Skeleton className="h-[150px] rounded-lg" />
            <Skeleton className="h-[150px] rounded-lg" />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link href={`/dashboard/projects/${project.id}`} key={project.id}>
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{project.nome}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.descricao || 'Este projeto não tem uma descrição.'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <h2 className="text-xl font-semibold">Nenhum projeto encontrado</h2>
                <p className="text-muted-foreground mt-2">Parece que você ainda não tem nenhum projeto.</p>
                {user?.tipo_usuario !== 'comum' && (
                    <Button onClick={handleCreateProjectClick} className="mt-4">
                        Criar seu primeiro projeto
                    </Button>
                )}
            </div>
        )}
      </div>
    </>
  );
}