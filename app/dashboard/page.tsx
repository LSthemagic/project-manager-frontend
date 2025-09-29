'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Project } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const fetchProjects = async (): Promise<Project[]> => {
  const { data } = await api.get('/projects');
  return data;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, isError } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  if (isLoading) return <div>Carregando projetos...</div>;
  if (isError) return <div>Ocorreu um erro ao buscar os projetos.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Projetos</h1>
        {user?.tipo_usuario !== 'comum' && (
          <Button>Criar Novo Projeto</Button>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
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
    </div>
  );
}