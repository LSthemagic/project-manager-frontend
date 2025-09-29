"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserNav } from "../_components/UserNav";
import { LayoutDashboard, FolderKanban, Users, Settings, Tags, BarChart, History, Calendar, Menu, X } from "lucide-react"; // Importar ícones
import { Searchbar } from "./_components/Searchbar";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-shrink-0 border-r bg-gray-100/40 dark:bg-gray-800/40">
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
              <Link href="/dashboard/calendar" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                <Calendar className="h-4 w-4" /> Calendário
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
                  <Link href="/dashboard/admin/audit" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                    <History className="h-4 w-4" /> Auditoria
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile (Overlay) */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <aside className="fixed left-0 top-0 z-50 h-full w-64 border-r bg-background md:hidden">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center justify-between border-b px-4">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 font-semibold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-6 w-6" />
                  <span>Synchro</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FolderKanban className="h-4 w-4" /> Projetos
                  </Link>
                  <Link 
                    href="/dashboard/calendar" 
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="h-4 w-4" /> Calendário
                  </Link>
                  {canSeeManagerLinks && (
                    <Link 
                      href="/dashboard/reports" 
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BarChart className="h-4 w-4" /> Relatórios
                    </Link>
                  )}
                  
                  {canSeeAdminLinks && (
                    <>
                      <Link 
                        href="/dashboard/admin/users" 
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Users className="h-4 w-4" /> Usuários
                      </Link>
                      <Link 
                        href="/dashboard/admin/categories" 
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" /> Categorias
                      </Link>
                      <Link 
                        href="/dashboard/admin/tags" 
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Tags className="h-4 w-4" /> Etiquetas
                      </Link>
                      <Link 
                        href="/dashboard/admin/audit" 
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <History className="h-4 w-4" /> Auditoria
                      </Link>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="w-full flex-1">
            <Searchbar />
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-2 sm:p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}