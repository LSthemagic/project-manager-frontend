'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Task } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Tipo específico para o resultado da busca, que é diferente do tipo Task padrão
type SearchResult = Omit<Task, 'id'> & {
  tarefa_id: number;
  projeto_nome: string;
};

const searchTasks = async (query: string): Promise<SearchResult[]> => {
  const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
  return data;
};

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  const { data: tasks, isLoading, isError } = useQuery<SearchResult[]>({
    queryKey: ['searchTasks', query],
    queryFn: () => searchTasks(query!),
    enabled: !!query && query.trim().length > 0,
  });

  if (!query) {
    return <div className="text-center p-8 text-muted-foreground">Digite algo na barra de busca para começar.</div>;
  }

  if (isLoading) {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Buscando por &quot;{query}&quot;...</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
                <Skeleton className="h-28 rounded-lg" />
            </div>
        </div>
    );
  }

  if (isError) return <div>Ocorreu um erro ao buscar pelos resultados.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Resultados da busca por &quot;{query}&quot;</h1>
      {tasks && tasks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            // CORREÇÃO: A key agora está no elemento pai e usa o ID correto (tarefa_id)
            <Link href={`/dashboard/projects/${task.projeto_id}`} key={task.tarefa_id}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{task.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.descricao || 'Sem descrição.'}
                  </p>
                   <p className="text-xs text-muted-foreground mt-2">
                    No projeto: <strong>{task.projeto_nome}</strong>
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
  <p className="text-center p-8 text-muted-foreground">Nenhum resultado encontrado para &quot;{query}&quot;.</p>
      )}
    </div>
  );
}


export default function SearchPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <SearchResults />
        </Suspense>
    )
}