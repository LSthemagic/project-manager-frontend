'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Task } from '@/lib/types';

import { CalendarDays, Clock, AlertTriangle, Circle, TrendingUp, MessageCircle, Paperclip } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// TaskCardProps removido: usamos TaskExtra diretamente abaixo

// Tipos extras vindos do backend
type TaskExtra = Task & {
  etiquetas?: { id: number; nome: string; cor: string }[];
  comentarios?: { id: number; conteudo: string }[];
  responsavel?: { id: number; nome: string; email: string };
  horas_trabalhadas?: number;
  anexos?: { id: number; nome_arquivo: string; caminho: string; tamanho: number; tipo_mime: string; tarefa_id: number; usuario_id: number; data_upload: string }[];
};

export function TaskCard({ task, onClick }: { task: TaskExtra; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task?.id || 0,
    disabled: !task || !task.id || task.id <= 0,
  });



  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0 : 1,
  };
  
  // Verificar se o task tem um ID válido após os hooks
  if (!task || !task.id || task.id <= 0) {
    console.warn("TaskCard recebeu task inválido:", task);
    return (
      <Card className="opacity-50 border-red-200">
        <CardHeader className="p-4">
          <CardTitle className="text-base text-red-500">Tarefa inválida</CardTitle>
        </CardHeader>
      </Card>
    );
  }


  // Funções auxiliares
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta': return 'destructive';
      case 'media': return 'default';
      case 'baixa': return 'secondary';
      default: return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta': return <AlertTriangle className="h-3 w-3" />;
      case 'media': return <TrendingUp className="h-3 w-3" />;
      case 'baixa': return <Circle className="h-3 w-3" />;
      default: return null;
    }
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'dd/MM', { locale: ptBR });
    } catch {
      return '';
    }
  };



  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        onClick={onClick}
        className={`hover:shadow-lg transition-all cursor-pointer ${
          isDragging ? 'shadow-2xl ring-2 ring-blue-200 rotate-2 scale-105' : ''
        }`}
      >
        <CardHeader className="p-3 pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium flex-1 line-clamp-2 leading-tight">
              {task.titulo}
            </CardTitle>
            {task.prioridade && (
              <Badge 
                variant={getPriorityColor(task.prioridade)} 
                className="flex-shrink-0 h-5 px-1.5 text-xs flex items-center gap-1"
              >
                {getPriorityIcon(task.prioridade)}
                <span className="hidden sm:inline">
                  {task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}
                </span>
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-3 pt-0 space-y-3 -mt-4">
          {/* Descrição */}
          {task.descricao && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.descricao}
            </p>
          )}

          {/* Etiquetas */}
          {Array.isArray(task.etiquetas) && task.etiquetas.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {task.etiquetas.slice(0, 3).map((tag) => (
                <Badge
                  key={tag.id}
                  className="text-xs px-1.5 py-0 h-5"
                  style={{ 
                    backgroundColor: tag.cor, 
                    color: 'white',
                    borderColor: tag.cor 
                  }}
                >
                  {tag.nome}
                </Badge>
              ))}
              {task.etiquetas.length > 3 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                  +{task.etiquetas.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer com informações adicionais */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-2">
              {/* Datas */}
              {(task.data_inicio || task.data_fim) && (
                <div className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>
                    {task.data_inicio && formatDate(task.data_inicio)}
                    {task.data_inicio && task.data_fim && ' - '}
                    {task.data_fim && formatDate(task.data_fim)}
                  </span>
                </div>
              )}

              {/* Estimativa de horas */}
              {task.estimativa_horas && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{task.estimativa_horas}h</span>
                </div>
              )}

              {/* Alerta de comentários com ícone e quantidade */}
              {Array.isArray(task.comentarios) && task.comentarios.length > 0 && (
                <span className="text-xs flex items-center gap-1">
                  <MessageCircle className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-400 font-semibold">{task.comentarios.length}</span>
                </span>
              )}
              {/* Alerta de anexos com ícone e quantidade */}
              {Array.isArray(task.anexos) && task.anexos.length > 0 && (
                <span className="text-xs flex items-center gap-1">
                  <Paperclip className="h-3 w-3 text-gray-400" />
                  <span className="text-gray-400 font-semibold">{task.anexos.length}</span>
                </span>
              )}
            </div>

            {/* Avatar do responsável (apenas iniciais) */}
            {task.responsavel && task.responsavel.nome ? (
              <Avatar className="h-6 w-6" title={task.responsavel.nome}>
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                  {getInitials(task.responsavel.nome)}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-6 w-6" title="Sem responsável definido">
                <AvatarFallback className="text-xs bg-gray-100 text-gray-400">
                  <Circle className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            )}

          </div>
        </CardContent>
      </Card>
    </div>
  );
}