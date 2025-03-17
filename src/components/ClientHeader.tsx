'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Title from '@/components/Title';
import { Home } from 'lucide-react';

export default function ClientHeader() {
  const pathname = usePathname();
  
  // No mostrar el header en páginas de propietario
  if (pathname?.includes('/propietario')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="inline-block">
          <Title text="OSUCOMPOST" />
        </Link>
        <Link href="/" className="p-2 hover:bg-green-100 rounded-full transition-colors" aria-label="Inicio">
          <Home size={24} className="sm:size-5 md:size-6 text-green-800" />
        </Link>
      </div>
    </header>
  );
}