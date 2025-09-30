import { Header } from '../_components/Header';
import { Footer } from '../_components/Footer';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Award, Heart, ArrowRight, Lightbulb, Shield, Rocket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">Sobre Nós</Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Nossa História</h1>
              <p className="max-w-[800px] text-gray-500 md:text-xl dark:text-gray-400">
                Conheça a equipe por trás do Synchro e nossa missão de transformar a gestão de projetos no Brasil.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <Badge variant="outline" className="mb-4">Nossa Missão</Badge>
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Democratizar a Gestão de Projetos
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Somos três desenvolvedores Full Stack, estudantes de Sistemas de Informação no IFBA - Instituto Federal da Bahia. 
                    Acreditamos que toda equipe merece ter acesso a ferramentas de gestão de projetos de qualidade. 
                    Nossa missão é tornar a colaboração mais simples, eficiente e acessível para todos.
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Nosso Objetivo</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Ser a plataforma de gestão de projetos mais intuitiva e completa do Brasil.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="lg:pl-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <CardHeader>
                    <div className="flex items-center space-x-2 mb-4">
                      <Heart className="h-6 w-6 text-red-500" />
                      <CardTitle>Nossos Valores</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-yellow-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Inovação</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Sempre buscamos novas formas de melhorar a experiência do usuário.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Confiabilidade</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Seus dados e projetos estão sempre seguros conosco.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h4 className="font-semibold">Colaboração</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Acreditamos no poder das equipes trabalhando juntas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="secondary" className="mb-4">Nossa Equipe</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Conheça Quem Faz Acontecer
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Uma equipe apaixonada por tecnologia e dedicada a criar soluções que fazem a diferença.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-5xl mx-auto">
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                    <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <Image
                      src="/images/profiles/joao.png" // Caminho relativo a 'public'
                      alt="Foto de perfil"
                      width={500} // Requer largura
                      height={300} // Requer altura
                      className="rounded-full object-cover h-24 w-24"
                    />
                    </div>
                  <CardTitle className="text-xl">João Henrique</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CEO & Co-Fundador</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Desenvolvedor Full Stack e estudante de Sistemas de Informação no IFBA. 
                    Lidera a visão de produto com foco em soluções inovadoras e transformação digital.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Image
                      src="/images/profiles/railan.jpg" // Caminho relativo a 'public'
                      alt="Foto de perfil"
                      width={500} // Requer largura
                      height={300} // Requer altura
                      className="rounded-full object-cover h-24 w-24"
                    />
                  </div>
                  <CardTitle className="text-xl">Railan Santana</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CEO & Co-Fundador</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Desenvolvedor Full Stack e estudante de Sistemas de Informação no IFBA. 
                    Especialista em arquitetura de sistemas e infraestrutura técnica da plataforma.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-center border-0 shadow-lg">
                <CardHeader>
                  <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <Image
                      src="/images/profiles/nadson.png" // Caminho relativo a 'public'
                      alt="Foto de perfil"
                      width={500} // Requer largura
                      height={300} // Requer altura
                      className="rounded-full object-cover h-24 w-24"
                    />
                  </div>
                  <CardTitle className="text-xl">Nadson Pereira</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CEO & Co-Fundador</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Desenvolvedor Full Stack e estudante de Sistemas de Informação no IFBA. 
                    Foca em experiência do usuário e desenvolvimento de funcionalidades intuitivas.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Company Stats */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="secondary" className="mb-4">Nosso Início</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Primeiros Passos
              </h2>
              <p className="max-w-[600px] text-gray-500 dark:text-gray-400">
                Como todo grande projeto, começamos do zero. Cada número representa nosso comprometimento e dedicação.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold">3</h3>
                <p className="text-gray-500 dark:text-gray-400">Fundadores Dedicados</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                  <Award className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold">1</h3>
                <p className="text-gray-500 dark:text-gray-400">Projeto Principal</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                  <Rocket className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold">2025</h3>
                <p className="text-gray-500 dark:text-gray-400">Ano de Fundação</p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                  <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold">100%</h3>
                <p className="text-gray-500 dark:text-gray-400">Dedicação</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                <Badge variant="secondary" className="mb-4">Nossa Jornada</Badge>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Como Tudo Começou
                </h2>
              </div>
              
              <div className="space-y-8">
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900 flex-shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">2024</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">A Ideia</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Durante as aulas de Sistemas de Informação no IFBA, três estudantes - João Henrique, Railan Santana 
                          e Nadson Pereira - identificaram a necessidade de uma ferramenta de gestão de projetos mais acessível 
                          e intuitiva para pequenas equipes e estudantes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900 flex-shrink-0">
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">2025</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Desenvolvimento</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Aplicando os conhecimentos adquiridos no curso, começamos o desenvolvimento do Synchro. 
                          Este é nosso primeiro projeto conjunto, combinando teoria acadêmica com aplicação prática 
                          em tecnologias Full Stack modernas.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900 flex-shrink-0">
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">Futuro</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Nossos Objetivos</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          Queremos aprender, crescer e contribuir para a comunidade tech. Este projeto representa nosso 
                          primeiro passo no mundo do desenvolvimento profissional, sempre com foco em criar soluções 
                          úteis e de qualidade.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Quer Fazer Parte da Nossa História?
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Junte-se a milhares de profissionis que já escolheram o Synchro para transformar seus projetos.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row mt-8">
                <Button size="lg" asChild>
                  <Link href="/auth/register">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/contact">Falar Conosco</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}