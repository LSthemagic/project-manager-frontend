'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';

export function Searchbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [debouncedQuery] = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedQuery) {
      params.set('q', debouncedQuery);
      // Se o usuário começar a digitar em qualquer página, leva para a busca
      if (pathname !== '/dashboard/search') {
        router.push(`/dashboard/search?${params.toString()}`);
      } else {
      // Se já estiver na busca, apenas atualiza a URL sem criar novo histórico
        router.replace(`/dashboard/search?${params.toString()}`);
      }
    } else {
      // Se a busca for limpa E o usuário estiver na página de busca, volta para o dashboard
      if (pathname === '/dashboard/search') {
        router.push('/dashboard');
      }
    }
  }, [debouncedQuery, pathname, router, searchParams]);

  return (
    <div className="relative w-full">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar tarefas..."
        className="w-full appearance-none bg-background pl-8 shadow-none"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}