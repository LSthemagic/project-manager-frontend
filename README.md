# Project Name

Project Manager · Frontend — Interface web responsiva para gerenciamento de projetos e tarefas.

# Problem

Organizações e times precisam coordenar projetos, tarefas e registros de tempo com clareza. Muitas soluções disponíveis são pesadas, pouco configuráveis e não oferecem rastreabilidade detalhada de ações administrativas e auditoria por padrão. Neste contexto técnico, expectativas típicas incluem integração com uma API REST/GraphQL, suporte a arrastar/soltar (kanban), uploads de anexos, controle de permissões por papéis e relatórios de produtividade.

Desafios deste domínio:
- garantir consistência entre estado local (UI) e estado remoto (API) em operações concorrentes (p.ex. arrastar tarefa enquanto outra atualização ocorre);
- manter performance e responsividade em listas grandes (kanban com muitas tarefas);
- lidar com arquivos e URLs de upload de forma segura e previsível;
- oferecer uma UX consistente para diferentes papéis de usuário (admin, gerente, usuário comum) sem expor funcionalidades não autorizadas.

# Solution

Esta aplicação resolve os problemas acima com uma aplicação Next.js que funciona como thin client rico em funcionalidades. A estratégia é delegar a lógica de negócio, autorizações e persistência ao backend e manter no frontend responsabilidades de apresentação, composição de UI, validação leve e orquestração de chamadas API.

Decisões arquiteturais e trade-offs:
- Framework: Next.js (App Router) para equilibrar performance e experiência de desenvolvimento; uso de rotas de página e componentes reutilizáveis para acelerar entrega.
- Data fetching: React Query para cache, sincronização e retries — reduz carga em requests e melhora UX em operações mutativas (optimistic updates quando aplicável).
- Comunicação com backend: axios centralizado em [lib/api.ts](lib/api.ts#L1-L40) com cookies habilitados (withCredentials) para autenticação baseada em sessão. Trade-off: cookies simplificam segurança em navegadores, mas exigem atenção a same-site e CSRF no backend.
- UI primitives: Radix + shadcn-ui para controles acessíveis e consistentes; Tailwind para design utilitário e velocidade de iteração.
- Estado local complexo (drag-and-drop, fórmulas de progresso): mantido localmente até commit ao servidor para evitar latência perceptível; eventual consistência aplicada com revalidação via React Query.

# Architecture

Client
↓
API
↓
Core Services
↓
Database / Cache
↓
External Providers

Component roles:
- Client: Next.js app que rende componentes React, gerencia rotas e apresenta a interface (app/* e components/*).
- API: backend separado (endpoints REST esperados em NEXT_PUBLIC_API_BASE_URL) que implementa autenticação, autorização, regras de negócio e upload de arquivos.
- Core Services: serviços do backend responsáveis por regras (ex.: regras de alocação de recursos, auditoria, geração de relatórios).
- Database / Cache: persistência relacional (ex.: PostgreSQL) e cache para leituras frequentes (Redis).
- External Providers: provedores de armazenamento (S3), provedores de e-mail e serviços de terceiros.

No frontend, responsabilidades específicas:
- Apresentação e composição de telas (páginas em app/).
- Componentes atômicos e compostos em components/ui para garantir reuso e acessibilidade.
- Orquestração de chamadas HTTP em lib/api.ts e modelagem de tipos em lib/types.ts.
- Contextos como AuthContext (contexts/AuthContext.tsx) centralizam estado de autenticação e permissões.

# Tech Stack

- Next.js — aplicação React com App Router: equilibrada entre performance e produtividade.
- React 19 + TypeScript — tipagem estática para reduzir bugs e melhorar a comunicação entre frontend/backend.
- axios — cliente HTTP configurado para baseURL compartilhada e cookies.
- @tanstack/react-query — cache de dados, sincronização e gerenciamento de estado assíncrono.
- Tailwind CSS — estilo utilitário para iterar rapidamente sem folhas de estilo volumosas.
- Radix UI + shadcn-ui — componentes acessíveis e consistentes para acelerar a construção da interface.
- @dnd-kit/core — drag-and-drop para Kanban e ordenação de listas.
- date-fns / date-fns-tz — manipulação de datas e fuso horário.

Por que essas escolhas:
- foco em DX e manutenção: Next.js + TypeScript + React Query fornecem um fluxo de desenvolvimento previsível e robusto;
- performance e UX: React Query + otimizações de cache reduzem roundtrips e melhoram latência aparente;
- acessibilidade e consistência: Radix + shadcn-ui evitam reimplementação de padrões acessíveis.

# Features

- Gestão de projetos: criar, editar e visualizar projetos com status, prioridade e progresso.
- Kanban interativo: arrastar e soltar tarefas entre colunas com atualizações otimizadas para servidor.
- Tarefas ricas: descrição, subtarefas, responsáveis, estimativas, anexos e comentários em tempo real básico.
- Uploads e anexos: normalização de URLs de upload via função utilitária em [lib/api.ts](lib/api.ts#L1-L40).
- Time tracking: registro de horas por tarefa com relatórios de produtividade.
- Painel administrativo: CRUD de usuários, categorias e etiquetas com logs de auditoria.
- Pesquisa e filtros: busca por projetos/tarefas com debounce (use-debounce) e paginação/ordenação.
- Relatórios: estatísticas do dashboard e relatórios de produtividade exportáveis.

# Installation

Clone e execute localmente:

git clone <repo>
cd project-manager-frontend
npm install

Crie um arquivo de ambiente conforme abaixo e execute o servidor de desenvolvimento:

npm run dev

Observação: o frontend espera um backend API separado; para desenvolvimento local, configure NEXT_PUBLIC_API_BASE_URL apontando para a API (ex.: http://localhost:3333/api).

# Environment Variables

Variáveis principais:
- NEXT_PUBLIC_API_BASE_URL — URL base da API (ex.: http://localhost:3333/api). Padrão local também está configurado em lib/api.ts.
- NEXT_PUBLIC_SENTRY_DSN — (opcional) DSN do Sentry para monitoramento de erros.

Considerações de segurança:
- Autenticação baseada em cookies: certifique-se que o backend configure SameSite e Secure corretamente em produção.
- Nunca exponha chaves privadas em variáveis NEXT_PUBLIC_*; estas são públicas no bundle.

# Usage

Fluxo básico de uso da aplicação:
- autenticar (login) via rota /auth/login; sessão é mantida via cookie;
- acessar dashboard para visão geral e métricas;
- criar ou abrir um projeto para gerenciar tarefas no modo kanban ou lista;
- adicionar comentários, anexos e logs de tempo nas tarefas;
- administradores podem acessar /dashboard/admin para gerenciar usuários, categorias e etiquetas.

Arquivos relevantes:
- componente de formulário de projeto: app/dashboard/_components/ProjectForm.tsx
- cliente API: [lib/api.ts](lib/api.ts#L1-L40)
- tipagens compartilhadas: [lib/types.ts](lib/types.ts#L1-L220)

# Example Request / Response

GET /projects (caminho esperado na API):

Request

GET {NEXT_PUBLIC_API_BASE_URL}/projects
Accept: application/json

Sample Response

[
	{
		"id": 42,
		"nome": "Lançamento Web",
		"descricao": "Landing page e painel administrativo",
		"status": "em_andamento",
		"prioridade": "alta",
		"data_inicio": "2026-02-01T00:00:00Z",
		"data_fim": null,
		"orcamento": 15000,
		"progresso": 37,
		"categoria_id": 3
	}
]

Este contrato segue os tipos definidos em [lib/types.ts](lib/types.ts#L1-L220).

# Project Structure

- app/ — rotas e páginas do Next.js (App Router). Contém layouts e páginas por domínio (dashboard, auth, projects).
- components/ — bibliotecas de UI reutilizáveis e primitives em components/ui.
- contexts/ — providers e contextos (ex.: AuthContext.tsx).
- lib/ — clientes HTTP, utilitários e tipagens (api.ts, types.ts, utils.ts).
- public/ — ativos estáticos e imagens de perfil.

Exemplos de arquivos-chave:
- [app/dashboard](app/dashboard) — entradas do painel e subcomponentes de projeto.
- [components/ui](components/ui) — botões, inputs, dialogs e outros primitives.
- [lib/api.ts](lib/api.ts#L1-L40) — cliente axios centralizado.
- [lib/types.ts](lib/types.ts#L1-L220) — contrato de dados compartilhado com backend.

# Future Improvements

- Armazenamento offline e sincronização para alterações do Kanban em redes instáveis.
- Implementar WebSockets para comentários em tempo real e atualizações de status colaborativas.
- Internacionalização (i18n) com suporte a múltiplos idiomas e formatação local de datas/monetização.
- Testes end-to-end (Cypress / Playwright) cobrindo fluxos críticos: autenticação, criação de tarefas e uploads.
- Integração com provedores de storage (S3) para uploads escaláveis e signed URLs.
- Melhorar políticas de autorização no frontend com feature flags e UI adaptativa por papel.

# Contributing

Contribuições são bem-vindas. Processo sugerido:
- fork do repositório;
- crie uma branch feature/<descrição>;
- escreva testes e atualize tipos quando necessário;
- envie um pull request com descrição do problema/solução e screenshots quando aplicável.

Antes de enviar PRs, rode lint e build localmente:

npm run lint
npm run build