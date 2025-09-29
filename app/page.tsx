import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from './_components/Header';
import { Footer } from './_components/Footer';
import { CheckCircle, Users, BarChart3, Clock, Shield, Zap, ArrowRight, Star } from 'lucide-react';
import api from '@/lib/api';

async function getPublicStats() {
  try {
    const response = await api.get('/reports/public-stats');
    
    return response.data;
  } catch (error) {
    console.error("Failed to fetch public stats:", error);
    // Retorna dados de fallback em caso de erro na API
    return {
      projectsCompleted: '10,000+',
      satisfactionRate: '95%',
      companiesTrust: '500+',
    };
  }
}

export default async function LandingPage() {
  const stats = await getPublicStats();

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        <section id="hero" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Gerencie Seus Projetos de Forma Inteligente
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                    Nossa plataforma oferece as ferramentas que você precisa para organizar tarefas, colaborar com sua equipe e entregar resultados no prazo.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/auth/register">Comece Gratuitamente</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="stats" className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Resultados que Falam por Si
              </h2>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{stats.projectsCompleted}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Projetos Concluídos</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{stats.satisfactionRate}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Taxa de Satisfação</p>
              </div>
              <div className="grid gap-1">
                <h3 className="text-lg font-bold">{stats.companiesTrust}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Empresas Confiam na Gente</p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">Funcionalidades</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Tudo que Você Precisa</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Nossa plataforma é construída com funcionalidades poderosas para otimizar seu fluxo de trabalho e impulsionar a produtividade da sua equipe.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-xl">Boards Kanban</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Organize tarefas visualmente com quadros Kanban intuitivos. Arraste e solte tarefas entre colunas e acompanhe o progresso em tempo real.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <CardTitle className="text-xl">Colaboração em Equipe</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Comente, anexe arquivos, atribua responsáveis e mantenha toda a equipe sincronizada em um só lugar.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <CardTitle className="text-xl">Relatórios e Análises</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Obtenha insights detalhados sobre produtividade, tempo gasto em tarefas e performance da equipe.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                    <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <CardTitle className="text-xl">Segurança Avançada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Controle de acesso por níveis, criptografia de dados e backup automático para manter seus projetos seguros.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                    <Zap className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <CardTitle className="text-xl">Performance Otimizada</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Interface rápida e responsiva, sincronização em tempo real e experiência fluida em qualquer dispositivo.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <CardTitle className="text-xl">Gestão Completa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400">
                    Desde o planejamento até a entrega, gerencie marcos, orçamentos, prazos e recursos em uma plataforma única.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <Badge variant="secondary" className="mb-4">Depoimentos</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">O Que Nossos Clientes Dizem</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">Maria Silva</CardTitle>
                  <p className="text-sm text-gray-500">Gerente de Projetos, TechCorp</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    &ldquo;O Synchro transformou completamente nossa forma de trabalhar. A visualização dos projetos é incrível e a colaboração da equipe melhorou 300%.&rdquo;
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">João Santos</CardTitle>
                  <p className="text-sm text-gray-500">CEO, StartupXYZ</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    &ldquo;Interface intuitiva e funcionalidades poderosas. Conseguimos reduzir o tempo de entrega dos projetos em 40% desde que começamos a usar.&rdquo;
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">Ana Costa</CardTitle>
                  <p className="text-sm text-gray-500">Diretora de Operações, BigCompany</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    &ldquo;Os relatórios detalhados nos ajudam a tomar decisões estratégicas. A segurança e confiabilidade são excepcionais.&rdquo;
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-blue-950 flex justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Pronto para Transformar Seus Projetos?
                </h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
                  Junte-se a milhares de equipes que já escolheram o Synchro para gerenciar seus projetos de forma mais eficiente.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/register">
                    Comece Gratuitamente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Falar com Vendas</Link>
                </Button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ✓ Sem cartão de crédito ✓ Configuração em 2 minutos ✓ Suporte 24/7
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}