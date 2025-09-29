"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DashboardStats, ProductivityReport } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get("/reports/dashboard");
  return data;
};

const fetchProductivityReport = async (): Promise<ProductivityReport[]> => {
  const { data } = await api.get("/reports/productivity");
  return data;
};

const StatCard = ({
  title,
  value,
  change,
}: {
  title: string;
  value: number;
  change: number;
}) => {
  const isPositive = change >= 0;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" && !isNaN(value) ? value : "Sem dados"}
        </div>

        <p
          className={cn(
            "text-xs text-muted-foreground flex items-center",
            isPositive ? "text-green-600" : "text-red-600"
          )}
        >
          {isPositive ? (
            <ArrowUp className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDown className="h-4 w-4 mr-1" />
          )}
          {typeof change === "number"
            ? `${change.toFixed(2)}% em relação ao mês anterior`
            : "Sem dados"}
        </p>
      </CardContent>
    </Card>
  );
};

export default function ReportsPage() {
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  const { data: productivityData, isLoading: isLoadingProductivity } = useQuery<
    ProductivityReport[]
  >({
    queryKey: ["productivityReport"],
    queryFn: fetchProductivityReport,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Executivo</h1>
        <p className="text-muted-foreground">
          Visão geral das métricas chave da plataforma.
        </p>
      </div>

      {isLoadingStats || !stats ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Projetos Ativos"
            value={stats.projetos_ativos.value}
            change={stats.projetos_ativos.change}
          />
          <StatCard
            title="Tarefas Pendentes"
            value={stats.tarefas_pendentes.value}
            change={stats.tarefas_pendentes.change}
          />
          <StatCard
            title="Tarefas Concluídas (Mês)"
            value={stats.tarefas_concluidas.value}
            change={stats.tarefas_concluidas.change}
          />
          <StatCard
            title="Horas Registradas (Mês)"
            value={Math.floor(stats.horas_mes_atual.value)}
            change={stats.horas_mes_atual.change}
          />
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold">Relatório de Produtividade</h2>
        <p className="text-muted-foreground">
          Desempenho dos usuários na plataforma.
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuário</TableHead>
              <TableHead>Projetos Envolvidos</TableHead>
              <TableHead>Total de Tarefas</TableHead>
              <TableHead>Tarefas Concluídas</TableHead>
              <TableHead>Taxa de Conclusão</TableHead>
              <TableHead>Total de Horas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingProductivity
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              : productivityData?.map((row) => (
                  <TableRow key={row.usuario_id}>
                    <TableCell className="font-medium">
                      {row.usuario_nome}
                    </TableCell>
                    <TableCell>{row.projetos_envolvidos}</TableCell>
                    <TableCell>{row.total_tarefas}</TableCell>
                    <TableCell>{row.tarefas_concluidas}</TableCell>
                    <TableCell>{row.taxa_conclusao_percent}%</TableCell>
                    <TableCell>
                      {parseFloat(row.total_horas_registradas).toFixed(2)}h
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
