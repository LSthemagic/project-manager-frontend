'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.tipo_usuario !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || user?.tipo_usuario !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Verificando permissões...</p>
      </div>
    );
  }

  return <>{children}</>;
}