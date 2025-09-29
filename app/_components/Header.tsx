'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white shadow-sm dark:bg-gray-950 relative">
      <Link href="/" className="flex items-center justify-center">
        <span className="text-xl font-bold">Synchro</span>
      </Link>
      
      <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
        <Link className="text-sm font-medium hover:underline underline-offset-4 transition-colors" href="/#features">
          Funcionalidades
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 transition-colors" href="/#testimonials">
          Depoimentos
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 transition-colors" href="/about">
          Sobre
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4 transition-colors" href="/contact">
          Contato
        </Link>
        <Button asChild>
          <Link href="/auth/login">
            Acessar Plataforma
          </Link>
        </Button>
      </nav>


      <button
        className="ml-auto md:hidden p-2"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white dark:bg-gray-950 shadow-lg border-t md:hidden z-50">
          <nav className="flex flex-col p-4 space-y-4">
            <Link 
              className="text-sm font-medium hover:underline underline-offset-4 py-2 transition-colors" 
              href="/#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Funcionalidades
            </Link>
            <Link 
              className="text-sm font-medium hover:underline underline-offset-4 py-2 transition-colors" 
              href="/#testimonials"
              onClick={() => setIsMenuOpen(false)}
            >
              Depoimentos
            </Link>
            <Link 
              className="text-sm font-medium hover:underline underline-offset-4 py-2 transition-colors" 
              href="/about"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              className="text-sm font-medium hover:underline underline-offset-4 py-2 transition-colors" 
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Button asChild className="mt-4">
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}>
                Acessar Plataforma
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}