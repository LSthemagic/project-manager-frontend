'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2 } from 'lucide-react';

// Assumindo que o tipo TimeLog será adicionado em lib/types.ts
type TimeLog = {
    id: number;
    horas: number;
    descricao: string;
    data_registro: string;
    usuario_nome: string;
    usuario_id: number;
};

const fetchTimeLogs = async (taskId: number): Promise<TimeLog[]> => {
    const { data } = await api.get(`/tasks/${taskId}/timelogs`);
    return data;
};

const addTimeLog = async ({ taskId, ...data }: { taskId: number } & z.infer<typeof timeLogSchema>) => {
    const { data: responseData } = await api.post(`/tasks/${taskId}/timelogs`, data);
    return responseData;
};

const deleteTimeLog = async (timelogId: number) => {
    await api.delete(`/timelogs/${timelogId}`);
};

const timeLogSchema = z.object({
    horas: z.coerce.number().min(0.1, { message: 'O valor deve ser positivo.' }),
    descricao: z.string().optional(),
});

type TimeLogTabProps = {
    taskId: number;
};

export function TimeLogTab({ taskId }: TimeLogTabProps) {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: timelogs, isLoading } = useQuery<TimeLog[]>({
        queryKey: ['timelogs', taskId],
        queryFn: () => fetchTimeLogs(taskId),
    });

    const addMutation = useMutation({
        mutationFn: addTimeLog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelogs', taskId] });
            form.reset();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteTimeLog,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timelogs', taskId] });
        },
    });

    const form = useForm<z.infer<typeof timeLogSchema>>({
        resolver: zodResolver(timeLogSchema),
        defaultValues: { horas: 0, descricao: '' },
    });

    const onSubmit = (values: z.infer<typeof timeLogSchema>) => {
        addMutation.mutate({ taskId, ...values });
    };
    
    const canDelete = (log: TimeLog) => {
        if (!user) return false;
        return user.tipo_usuario === 'admin' || user.tipo_usuario === 'gerente' || user.id === log.usuario_id;
    }

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-4">
                {isLoading && <p>Carregando registros...</p>}
                {timelogs?.map((log) => (
                    <div key={log.id} className="flex items-center justify-between text-sm">
                        <div>
                            <span className="font-semibold">{log.horas}h</span> por <span className="font-semibold">{log.usuario_nome}</span>
                            <p className="text-muted-foreground">{log.descricao}</p>
                        </div>
                        {canDelete(log) && (
                             <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(log.id)}>
                                <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                ))}
                 {timelogs?.length === 0 && !isLoading && <p className="text-sm text-muted-foreground">Nenhum registro de tempo encontrado.</p>}
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
                    <FormField
                        control={form.control}
                        name="horas"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horas</FormLabel>
                                <FormControl><Input type="number" step="0.1" className="w-24" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Descrição</FormLabel>
                                <FormControl><Input placeholder="O que foi feito?" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" disabled={addMutation.isPending}>Registrar</Button>
                </form>
            </Form>
        </div>
    );
}