'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  format, 
  parseISO, 
  isValid, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval,
  addMonths,
  subMonths
} from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import { Project as BaseProject } from '@/lib/types';
import { ProjectForm } from '../../_components/ProjectForm';

interface Project extends BaseProject {
  data_criacao: string;
  data_atualizacao: string;
}



const statusColors = {
  planejamento: 'bg-blue-500',
  em_andamento: 'bg-yellow-500',
  concluido: 'bg-green-500',
  cancelado: 'bg-red-500'
};

const fetchProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export function CalendarView() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedDateForProject, setSelectedDateForProject] = useState<Date | null>(null);
  const [showMoreProjectsModal, setShowMoreProjectsModal] = useState(false);
  const [selectedDayProjects, setSelectedDayProjects] = useState<{ projects: Project[], date: Date | null }>({ projects: [], date: null });

  const { 
    data: projects = [], 
    isLoading: loading, 
    error
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false, // Não recarrega ao focar na janela
    refetchOnMount: false, // Não recarrega ao montar se há dados em cache
    gcTime: 10 * 60 * 1000, // Mantém cache por 10 minutos
  });

  // Gerar os dias do mês atual - memoizado para evitar recálculos
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 }); // Domingo = 0
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      days.push(new Date(day)); // Criar nova instância para evitar referência
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  // Filtrar projetos baseado no status - memoizado
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      filterStatus === 'all' || project.status === filterStatus
    );
  }, [projects, filterStatus]);

  // Obter timezone do usuário
  const userTimeZone = typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'America/Sao_Paulo';

  // Obter projetos que se estendem por um período - memoizado
  const periodProjects = useMemo(() => {
    return filteredProjects.filter(project => {
      const startDate = project.data_inicio ? toZonedTime(parseISO(project.data_inicio), userTimeZone) : null;
      const endDate = project.data_fim ? toZonedTime(parseISO(project.data_fim), userTimeZone) : null;
      return startDate && endDate && isValid(startDate) && isValid(endDate);
    }).map(project => ({
      ...project,
      startDate: toZonedTime(parseISO(project.data_inicio!), userTimeZone),
      endDate: toZonedTime(parseISO(project.data_fim!), userTimeZone)
    }));
  }, [filteredProjects, userTimeZone]);

  // Obter projetos pontuais (sem período definido) - callback otimizado
  const getPointProjects = useCallback((date: Date) => {
    return filteredProjects.filter(project => {
      const startDate = project.data_inicio ? toZonedTime(parseISO(project.data_inicio), userTimeZone) : null;
      const endDate = project.data_fim ? toZonedTime(parseISO(project.data_fim), userTimeZone) : null;
      const creationDate = toZonedTime(parseISO(project.data_criacao), userTimeZone);

      // Se não tem período definido, mostra na data de criação
      if (!startDate || !endDate) {
        return isSameDay(date, creationDate);
      }

      return false;
    });
  }, [filteredProjects, userTimeZone]);

  // Handler para abrir modal de criação de projeto - otimizado
  const handleDateClick = useCallback((date: Date) => {
    setSelectedDateForProject(date);
    setIsProjectModalOpen(true);
  }, []);

  // Handler para mostrar todos os projetos de um dia - otimizado
  const handleShowMoreProjects = useCallback((date: Date, projects: Project[]) => {
    setSelectedDayProjects({ projects, date });
    setShowMoreProjectsModal(true);
  }, []);

  // Handler para quando o modal fechar - recarregar projetos - otimizado
  const handleModalClose = useCallback((isOpen: boolean) => {
    setIsProjectModalOpen(isOpen);
    if (!isOpen) {
      queryClient.invalidateQueries({ queryKey: ['projects'] }); // Invalida o cache para recarregar os projetos
    }
  }, [queryClient]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Carregando projetos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">{error?.message || 'Erro ao carregar projetos'}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full pb-8">
      {/* Header do Calendário */}
      <Card className="mb-4 md:mb-6">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle className="text-xl md:text-2xl">
                {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
              </CardTitle>
              <CardDescription className="hidden sm:block">
                Calendário de Projetos - Clique em uma data para criar um projeto
              </CardDescription>
            </div>
            
            <div className="flex flex-col gap-4">
              {/* Controles principais - Select e navegação */}
              <div className="flex flex-row gap-3 justify-end items-end self-end">
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full xs:w-48 sm:w-52">
                    <SelectValue placeholder="Filtrar por status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
            
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className='cursor-pointer'
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className='cursor-pointer'
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                
              </div>

              {/* Legenda - Melhor responsividade */}
              <div className="flex flex-wrap items-center gap-3 text-sm border-t pt-3 sm:border-t-0 sm:pt-0">
                <span className="font-medium text-gray-600 dark:text-gray-400 text-xs sm:text-sm">Status:</span>
                <div className="flex flex-wrap items-center gap-3">
                  {Object.entries(statusColors).map(([status, color]) => (
                    <div key={status} className="flex items-center gap-1">
                      <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded ${color}`}></div>
                      <span className="text-gray-600 dark:text-gray-400 capitalize text-xs sm:text-sm">
                        {status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid do Calendário */}
      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 h-full overflow-x-auto min-w-full">
            {/* Header dos dias da semana */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div 
                key={day} 
                className="p-2 sm:p-3 text-center font-medium text-xs sm:text-sm bg-gray-50 dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 last:border-r-0"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}

            {/* Dias do calendário */}
            {calendarDays.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday = isSameDay(day, new Date());
              const pointProjects = getPointProjects(day);

              return (
                <div
                  key={`${format(day, 'yyyy-MM-dd')}-${dayIndex}`}
                  className={`
                    min-h-28 sm:min-h-40 lg:min-h-48 p-1 sm:p-2 border-r border-b border-gray-200 dark:border-gray-700 relative overflow-hidden last:border-r-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
                    ${!isCurrentMonth ? 'bg-gray-50 dark:bg-gray-900 text-gray-400' : 'bg-white dark:bg-gray-950'}
                    ${isToday ? 'bg-blue-50 dark:bg-blue-950' : ''}
                  `}
                  onClick={() => handleDateClick(day)}
                >
                  {/* Número do dia */}
                  <div className={`text-xs sm:text-sm font-medium mb-1 ${isToday ? 'text-blue-600 font-bold' : ''}`}>
                    {format(day, 'd')}
                  </div>

                  {/* Projetos pontuais */}
                  <div className="space-y-0.5 sm:space-y-1">
                    {pointProjects.slice(0, 2).map((project) => (
                      <div
                        key={project.id}
                        className={`
                          text-xs p-0.5 sm:p-1 rounded cursor-pointer truncate text-white
                          ${statusColors[project.status]}
                        `}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/projects/${project.id}`);
                        }}
                        title={project.nome}
                      >
                        <span className="hidden sm:inline">{project.nome}</span>
                        <span className="sm:hidden">{project.nome.substring(0, 8)}...</span>
                      </div>
                    ))}
                    {pointProjects.length > 2 && (
                      <div 
                        className="text-xs text-blue-600 hover:text-blue-800 px-1 cursor-pointer font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowMoreProjects(day, pointProjects);
                        }}
                        title="Clique para ver todos os projetos"
                      >
                        +{pointProjects.length - 2} mais
                      </div>
                    )}
                  </div>

                  {/* Projetos em período */}
                  {periodProjects
                    .filter(project => isWithinInterval(day, { start: project.startDate, end: project.endDate }))
                    .map((project, projectIndex) => {
                      const isStartDay = isSameDay(project.startDate, day);
                      const isEndDay = isSameDay(project.endDate, day);
                      
                      return (
                        <div
                          key={`period-${project.id}-${format(day, 'yyyy-MM-dd')}`}
                          className={`
                            absolute text-xs px-1 py-0.5 cursor-pointer text-white truncate font-medium
                            ${statusColors[project.status]}
                            shadow-sm hover:shadow-md transition-shadow
                            ${isStartDay ? 'rounded-l-md' : 'rounded-l-none'}
                            ${isEndDay ? 'rounded-r-md' : 'rounded-r-none'}
                            ${!isStartDay && !isEndDay ? 'rounded-none' : ''}
                          `}
                          style={{
                            bottom: `${8 + projectIndex * 20}px`,
                            left: '1px',
                            right: '1px',
                            zIndex: 10 + projectIndex,
                            height: '16px',
                            lineHeight: '14px',
                            fontSize: '10px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/projects/${project.id}`);
                          }}
                          title={`${project.nome} (${format(project.startDate, 'dd/MM')} - ${format(project.endDate, 'dd/MM')})`}
                        >
                          {/* Mostrar nome apenas no primeiro dia */}
                          {isStartDay && (
                            <>
                              <span className="hidden sm:inline">{project.nome}</span>
                              <span className="sm:hidden">{project.nome.substring(0, 6)}</span>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de criação de projeto */}
      <ProjectForm 
        isOpen={isProjectModalOpen}
        onOpenChange={handleModalClose}
        project={selectedDateForProject ? {
          id: 0,
          nome: '',
          descricao: '',
          status: 'planejamento' as const,
          prioridade: 'media' as const,
          data_inicio: selectedDateForProject.toISOString(),
          data_fim: null,
          orcamento: null,
          categoria_id: 1
        } : null}
      />

      {/* Modal para mostrar todos os projetos de um dia */}
      <Dialog open={showMoreProjectsModal} onOpenChange={setShowMoreProjectsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Projetos - {selectedDayProjects.date && format(selectedDayProjects.date, "dd 'de' MMMM", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {selectedDayProjects.projects.map((project) => (
              <div
                key={project.id}
                className={`
                  p-3 rounded-lg cursor-pointer transition-colors hover:opacity-80
                  ${statusColors[project.status]} text-white
                `}
                onClick={() => {
                  setShowMoreProjectsModal(false);
                  router.push(`/dashboard/projects/${project.id}`);
                }}
              >
                <div className="font-medium">{project.nome}</div>
                {project.descricao && (
                  <div className="text-sm opacity-90 mt-1">{project.descricao}</div>
                )}
                <div className="text-xs opacity-75 mt-2 flex items-center gap-2">
                  <span className="capitalize">{project.status.replace('_', ' ')}</span>
                  <span>•</span>
                  <span className="capitalize">{project.prioridade}</span>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}