"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserNav } from "../_components/UserNav";
import { LayoutDashboard, FolderKanban, Users, Settings, Tags, BarChart, History } from "lucide-react"; // Importar ícones
import { Searchbar } from "./_components/Searchbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }
  
  const canSeeAdminLinks = user.tipo_usuario === "admin";
  const canSeeManagerLinks = user.tipo_usuario === "admin" || user.tipo_usuario === "gerente";

  return (
    <div className="flex h-screen">
      <aside className="w-64 flex-shrink-0 border-r bg-gray-100/40 dark:bg-gray-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <LayoutDashboard className="h-6 w-6" />
              <span>Synchro</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <FolderKanban className="h-4 w-4" /> Projetos
              </Link>

              {canSeeManagerLinks && (
                 <Link href="/dashboard/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <BarChart className="h-4 w-4" /> Relatórios
                  </Link>
              )}
              
              {canSeeAdminLinks && (
                <>
                  <Link href="/dashboard/admin/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Users className="h-4 w-4" /> Usuários
                  </Link>
                  <Link href="/dashboard/admin/categories" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Settings className="h-4 w-4" /> Categorias
                  </Link>
                  <Link href="/dashboard/admin/tags" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <Tags className="h-4 w-4" /> Etiquetas
                  </Link>
                  {/* NOVO LINK ADICIONADO AQUI */}
                   <Link href="/dashboard/admin/audit" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <History className="h-4 w-4" /> Auditoria
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </aside>
      <div className="flex flex-col flex-1">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
            <Searchbar />
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}