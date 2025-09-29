'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const formSchema = z.object({
  nome: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  tipo_usuario: z.enum(['comum', 'gerente', 'admin']),
  senha: z.string().optional(),
}).refine(data => {
    // A senha só é obrigatória se não estivermos editando um usuário (ou seja, quando não há `id`)
    // Esta lógica será aplicada no componente pai, mas a definição está aqui.
    return true;
});


type UserFormProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  user?: User | null;
};

const createUser = (data: Omit<z.infer<typeof formSchema>, 'senha'> & { senha?: string }) => api.post('/users', data);
const updateUser = ({ id, ...data }: { id: number } & Omit<z.infer<typeof formSchema>, 'senha'>) => api.put(`/users/${id}`, data);


export function UserForm({ isOpen, onOpenChange, user }: UserFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!user;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: '',
      email: '',
      tipo_usuario: 'comum',
      senha: '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nome: user.nome,
        email: user.email,
        tipo_usuario: user.tipo_usuario,
        senha: '',
      });
    } else {
      form.reset({
        nome: '',
        email: '',
        tipo_usuario: 'comum',
        senha: '',
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: isEditing ? updateUser : createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Erro ao salvar usuário:", error);
      // Aqui você pode adicionar um toast ou estado de erro
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dataToSend: any = values;
    if (isEditing) {
      dataToSend.id = user.id;
      // Não enviamos a senha se o campo estiver vazio durante a edição
      if (!values.senha) {
        delete dataToSend.senha;
      }
    } else {
        if (!values.senha) {
            form.setError("senha", { type: "manual", message: "A senha é obrigatória para novos usuários." });
            return;
        }
    }
    mutation.mutate(dataToSend);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipo_usuario"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Usuário</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="comum">Comum</SelectItem>
                      <SelectItem value="gerente">Gerente</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl><Input type="password" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}