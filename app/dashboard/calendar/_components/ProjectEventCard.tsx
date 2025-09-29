import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, DollarSign } from 'lucide-react';

interface Project {
  id: number;
  nome: string;
  descricao: string;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta';
  data_inicio: string | null;
  data_fim: string | null;
  orcamento: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

interface ProjectEventCardProps {
  project: Project;
  onClick?: () => void;
}

const statusConfig = {
  planejamento: { 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    label: 'Planejamento'
  },
  em_andamento: { 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    label: 'Em Andamento'
  },
  concluido: { 
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    label: 'Concluído'
  },
  cancelado: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Cancelado'
  }
};

const priorityConfig = {
  baixa: { 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    label: 'Baixa'
  },
  media: { 
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    label: 'Média'
  },
  alta: { 
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    label: 'Alta'
  }
};

export function ProjectEventCard({ project, onClick }: ProjectEventCardProps) {
  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com título e badges */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm line-clamp-2 flex-1">
              {project.nome}
            </h3>
            <div className="flex flex-col gap-1">
              <Badge 
                variant="secondary" 
                className={`text-xs ${statusConfig[project.status].color}`}
              >
                {statusConfig[project.status].label}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${priorityConfig[project.prioridade].color}`}
              >
                {priorityConfig[project.prioridade].label}
              </Badge>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.descricao}
          </p>

          {/* Informações adicionais */}
          <div className="space-y-1">
            {(project.data_inicio || project.data_fim) && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3 w-3" />
                <span>
                  {project.data_inicio && format(parseISO(project.data_inicio), "dd/MM", { locale: ptBR })}
                  {project.data_inicio && project.data_fim && ' - '}
                  {project.data_fim && format(parseISO(project.data_fim), "dd/MM", { locale: ptBR })}
                </span>
              </div>
            )}
            
            {project.orcamento && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="h-3 w-3" />
                <span>R$ {parseFloat(project.orcamento).toLocaleString('pt-BR')}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>
                Criado em {format(parseISO(project.data_criacao), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}