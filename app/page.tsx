import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from './_components/Header';
import { Footer } from './_components/Footer';
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
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">O Que Fazemos</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  Nossa plataforma é construída com funcionalidades poderosas para otimizar seu fluxo de trabalho.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Boards Kanban</h3>
                <p className="text-gray-500 dark:text-gray-400">Organize tarefas visualmente e acompanhe o progresso em tempo real.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Colaboração em Equipe</h3>
                <p className="text-gray-500 dark:text-gray-400">Comente, anexe arquivos e mantenha todos na mesma página.</p>
              </div>
              <div className="grid gap-1 text-center">
                <h3 className="text-xl font-bold">Relatórios e Análises</h3>
                <p className="text-gray-500 dark:text-gray-400">Obtenha insights sobre a produtividade da sua equipe e o andamento dos projetos.</p>
              </div>
            </div>
          </div>
        </section>
        
        <section id="about" className="w-full py-12 md:py-24 lg:py-32 flex justify-center">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Quem Somos
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Somos uma equipe apaixonada por produtividade e tecnologia, dedicada a criar ferramentas que simplificam o trabalho e impulsionam resultados. Nossa missão é transformar a maneira como as equipes colaboram.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}