export type User = {
  id: number;
  nome: string;
  email: string;
  tipo_usuario: 'admin' | 'gerente' | 'comum';
};

export type Project = {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  progresso?: number;
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
};

// Novos tipos
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