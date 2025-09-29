import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm dark:bg-gray-950">
      <Link href="/" className="flex items-center justify-center">
        <span className="text-xl font-bold">Synchro</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
          Funcionalidades
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="#about">
          Sobre
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/contact">
          Contato
        </Link>
        <Button asChild>
          <Link href="/auth/login">Acessar Plataforma</Link>
        </Button>
      </nav>
    </header>
  );
}