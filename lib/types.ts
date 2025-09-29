export type User = {
  id: number;
  nome: string;
  email: string;
  profile_picture?: string | null;
  tipo_usuario: 'admin' | 'gerente' | 'comum';
};

export type Project = {
  id: number;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta';
  data_inicio: string | null;
  data_fim: string | null;
  orcamento: number | null;
  progresso?: number;
  categoria_id: number;
  team_id?: number;
  lider_id?: number;
};


export type TaskStatus = {
  id: number;
  nome: string;
  cor: string;
};

export type Task = {
  id: number;
  titulo: string;
  descricao: string | null;
  prioridade: 'baixa' | 'media' | 'alta';
  projeto_id: number;
  status_id: number;
  responsavel_id: number | null;
  data_inicio: string | null;
  data_fim: string | null;
  estimativa_horas: number | null;
};

export type Comment = {
  id: number;
  conteudo: string;
  tarefa_id: number;
  usuario_id: number;
  data_criacao: string;
  usuario_nome: string;
};

export type Subtask = {
  id: number;
  titulo: string;
  concluida: boolean;
  tarefa_id: number;
};

export type Attachment = {
  id: number;
  nome_arquivo: string;
  caminho: string;
  tarefa_id: number;
};

export type Category = {
  id: number;
  nome: string;
  descricao: string | null;
  cor: string;
};

export type TimeLog = {
    id: number;
    horas: number;
    descricao: string;
    data_registro: string;
    usuario_nome: string;
    usuario_id: number;
};

export type Etiqueta = {
  id: number;
  nome: string;
  cor: string;
}

export type TeamMember = {
    id: number;
    nome: string;
    email: string;
    data_entrada: string;
    papel: string;
}

export type DashboardStats = {
    total_usuarios_ativos: { value: number; change: number };
    projetos_ativos: { value: number; change: number };
    tarefas_pendentes: { value: number; change: number };
    tarefas_concluidas: { value: number; change: number };
    horas_mes_atual: { value: number; change: number };
    progresso_medio_projetos: { value: number; change: number };
    projetos_atrasados: { value: number; change: number };
};

export type ProductivityReport = {
  usuario_id: number;
  usuario_nome: string;
  usuario_email?: string;
  tipo_usuario?: 'admin' | 'gerente' | 'comum' | string;
  projetos_envolvidos: number | string;
  total_tarefas: number | string;
  tarefas_concluidas: number | string;
  tarefas_em_progresso?: number | string;
  tarefas_pendentes?: number | string;
  taxa_conclusao_percent: number | string;
  media_horas_por_registro?: number | string;
  total_horas_registradas: number | string;
  ultima_atividade?: string | null;
};

export type AuditLog = {
    id: number;
    tabela: string;
    operacao: string;
    registro_id: number;
  dados_antigos: Record<string, unknown> | null;
  dados_novos: Record<string, unknown> | null;
    usuario_id: number;
    usuario_nome: string;
    data_operacao: string;
}