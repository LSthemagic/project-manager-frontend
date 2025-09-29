'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Header } from '../_components/Header';
import { Footer } from '../_components/Footer';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const contactFormSchema = z.object({
  nome: z.string().min(2, { message: 'O nome é obrigatório.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  mensagem: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});

export default function ContactPage() {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      mensagem: '',
    },
  });

  async function onSubmit(values: z.infer<typeof contactFormSchema>) {
    setError('');
    setSuccess('');
    try {
      await api.post('/contact', values);
      setSuccess('Sua mensagem foi enviada com sucesso! Entraremos em contato em breve.');
      form.reset();
    } catch {
      setError('Ocorreu um erro ao enviar a mensagem. Tente novamente mais tarde.');
    }
  }

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">Contato</Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Entre em Contato</h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                Estamos aqui para ajudar. Entre em contato conosco e descubra como o Synchro pode transformar seus projetos.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Content */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold">Vamos Conversar</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    Nossa equipe está pronta para entender suas necessidades e apresentar as melhores soluções para sua empresa.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-gray-500 dark:text-gray-400">contato@synchro.com</p>
                      <p className="text-sm text-gray-400">Respondemos em até 24 horas</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                      <Phone className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Telefone</h3>
                      <p className="text-gray-500 dark:text-gray-400">+55 (75) 3221-8888</p>
                      <p className="text-sm text-gray-400">Seg - Sex, 9h às 18h</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                      <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Endereço</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Av. Getúlio Vargas, 2263<br />
                        Feira de Santana, BA - 44075-110
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Horário de Funcionamento</h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Segunda a Sexta: 9h às 18h<br />
                        Sábado: 9h às 12h
                      </p>
                    </div>
                  </div>
                </div>

                <Card className="border-0 bg-blue-50 dark:bg-blue-950">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-blue-900 dark:text-blue-100">Suporte Premium</h3>
                    </div>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      Clientes Premium têm acesso a suporte prioritário 24/7 e consultorias personalizadas.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="lg:pl-8">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Envie sua Mensagem</CardTitle>
                    <p className="text-gray-500 dark:text-gray-400">
                      Preencha o formulário abaixo e nossa equipe entrará em contato em breve.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                          control={form.control}
                          name="nome"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome Completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Profissional</FormLabel>
                              <FormControl>
                                <Input placeholder="seu.email@empresa.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mensagem"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mensagem</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Conte-nos sobre seu projeto, quantas pessoas na equipe, principais desafios, etc." 
                                  className="min-h-[120px]" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        {error && (
                          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>
                          </div>
                        )}
                        
                        {success && (
                          <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                            <p className="text-sm font-medium text-green-600 dark:text-green-400">{success}</p>
                          </div>
                        )}
                        
                        <Button type="submit" className="w-full" size="lg">
                          <Send className="mr-2 h-4 w-4" />
                          Enviar Mensagem
                        </Button>
                        
                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                          Ao enviar este formulário, você concorda com nossa política de privacidade.
                        </p>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full py-12 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <Badge variant="secondary" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Perguntas Frequentes</h2>
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Quanto tempo leva para implementar?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    A implementação básica leva apenas 2 minutos. Para configurações avançadas e treinamento da equipe, reserve 1-2 semanas.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Vocês oferecem treinamento?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sim! Oferecemos treinamento online ao vivo, materiais de apoio e suporte contínuo para garantir o sucesso da sua equipe.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Posso migrar meus dados atuais?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Absolutamente! Nosso time de suporte ajuda na migração de dados de outras ferramentas como Trello, Asana, Jira e planilhas.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Qual o nível de segurança?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300">
                    Utilizamos criptografia de nível bancário, backup automático e compliance com LGPD. Seus dados estão sempre protegidos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}