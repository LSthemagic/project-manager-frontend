'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AuditLog } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const fetchAuditLogs = async (): Promise<AuditLog[]> => {
  const { data } = await api.get('/admin/audit/log');
  return data;
};

export default function AuditPage() {
  const { data: logs, isLoading, isError } = useQuery<AuditLog[]>({
    queryKey: ['auditLogs'],
    queryFn: fetchAuditLogs,
  });

  const getOperationVariant = (op: string) => {
    switch (op) {
      case 'INSERT': return 'default';
      case 'UPDATE': return 'secondary';
      case 'DELETE': return 'destructive';
      default: return 'outline';
    }
  }

  if (isError) return <div>Ocorreu um erro ao buscar os logs de auditoria.</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Log de Auditoria</h1>
        <p className="text-muted-foreground">Registro de todas as operações importantes realizadas no sistema.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Operação</TableHead>
              <TableHead>Tabela</TableHead>
              <TableHead>Registro ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              ))
            ) : (
              logs?.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{format(new Date(log.data_operacao), "dd/MM/yyyy 'às' HH:mm:ss", { locale: ptBR })}</TableCell>
                  <TableCell>{log.usuario_nome}</TableCell>
                  <TableCell>
                    <Badge variant={getOperationVariant(log.operacao)}>{log.operacao}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{log.tabela}</TableCell>
                  <TableCell>{log.registro_id}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}