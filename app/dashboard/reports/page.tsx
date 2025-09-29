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
  console.log("data dashboard", data);

  const parseNumber = (v: unknown) => {
    if (v === null || v === undefined) return 0;
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const parseChange = (s: unknown) => {
    if (s === null || s === undefined) return 0;
    if (typeof s === "number") return s;
    const str = String(s).replace(/\+/g, "").replace(/%/g, "").trim();
    const n = Number(str);
    return Number.isFinite(n) ? n : 0;
  };

  // A API retorna valores como strings e um objeto `changes` com '%'.
  return {
    total_usuarios_ativos: {
      value: parseNumber(data.total_usuarios_ativos),
      change: parseChange(data.changes?.total_usuarios_ativos),
    },
    projetos_ativos: {
      value: parseNumber(data.projetos_ativos),
      change: parseChange(data.changes?.projetos_ativos),
    },
    tarefas_pendentes: {
      value: parseNumber(data.tarefas_pendentes),
      change: parseChange(data.changes?.tarefas_pendentes),
    },
    tarefas_concluidas: {
      value: parseNumber(data.tarefas_concluidas),
      change: parseChange(data.changes?.tarefas_concluidas),
    },
    horas_mes_atual: {
      value: parseNumber(data.horas_mes_atual),
      change: parseChange(data.changes?.horas_mes_atual),
    },
    progresso_medio_projetos: {
      value: parseNumber(data.progresso_medio_projetos),
      change: parseChange(data.changes?.progresso_medio_projetos),
    },
    projetos_atrasados: {
      value: parseNumber(data.projetos_atrasados),
      change: parseChange(data.changes?.projetos_atrasados),
    },
  };
};

const fetchProductivityReport = async (): Promise<ProductivityReport[]> => {
  const { data } = await api.get("/reports/productivity");
  console.log("data productivity",data);
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
            value={Number(stats.projetos_ativos.value)}
            change={Number(stats.projetos_ativos.change)}
          />
          <StatCard
            title="Tarefas Pendentes"
            value={Number(stats.tarefas_pendentes.value)}
            change={Number(stats.tarefas_pendentes.change)}
          />
          <StatCard
            title="Tarefas Concluídas (Mês)"
            value={Number(stats.tarefas_concluidas.value)}
            change={Number(stats.tarefas_concluidas.change)}
          />
          <StatCard
            title="Horas Registradas (Mês)"
            value={Math.floor(Number(stats.horas_mes_atual.value))}
            change={Number(stats.horas_mes_atual.change)}
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
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Projetos Envolvidos</TableHead>
              <TableHead>Total de Tarefas</TableHead>
              <TableHead>Em Progresso</TableHead>
              <TableHead>Pendentes</TableHead>
              <TableHead>Tarefas Concluídas</TableHead>
              <TableHead>Taxa de Conclusão</TableHead>
              <TableHead>Média H/Registro</TableHead>
              <TableHead>Total de Horas</TableHead>
              <TableHead>Última Atividade</TableHead>
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
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
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
                      <Skeleton className="h-5 w-28" />
                    </TableCell>
                  </TableRow>
                ))
              : productivityData?.map((row) => {
                  // normalizar valores que podem vir como string
                  const projetos = Number(row.projetos_envolvidos ?? 0);
                  const totalTarefas = Number(row.total_tarefas ?? 0);
                  const emProgresso = Number(row.tarefas_em_progresso ?? 0);
                  const pendentes = Number(row.tarefas_pendentes ?? 0);
                  const concluidas = Number(row.tarefas_concluidas ?? 0);
                  const taxa = Number(row.taxa_conclusao_percent ?? 0);
                  const mediaHoras = Number(row.media_horas_por_registro ?? 0);
                  const totalHoras = Number(row.total_horas_registradas ?? 0);
                  const ultimaAtividade = row.ultima_atividade
                    ? new Date(row.ultima_atividade)
                    : null;

                  return (
                    <TableRow key={row.usuario_id}>
                      <TableCell className="font-medium">
                        {row.usuario_nome}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.usuario_email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.tipo_usuario}
                      </TableCell>
                      <TableCell>{projetos}</TableCell>
                      <TableCell>{totalTarefas}</TableCell>
                      <TableCell>{emProgresso}</TableCell>
                      <TableCell>{pendentes}</TableCell>
                      <TableCell>{concluidas}</TableCell>
                      <TableCell>{taxa.toFixed(2)}%</TableCell>
                      <TableCell>{mediaHoras.toFixed(2)}h</TableCell>
                      <TableCell>{totalHoras.toFixed(2)}h</TableCell>
                      <TableCell>
                        {ultimaAtividade
                          ? ultimaAtividade.toLocaleString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
