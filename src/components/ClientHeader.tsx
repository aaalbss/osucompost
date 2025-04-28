'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Title from '@/components/Title';
import { Home } from 'lucide-react';

export default function ClientHeader() {
  const pathname = usePathname();
  
  // No mostrar el header en páginas de propietario ni en operarios
  if (pathname?.includes('/propietario') || pathname?.includes('/operarios')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <Link href="/" className="inline-block">
          <Title text="OSUCOMPOST" />
        </Link>
        <Link href="/" className="p-2 transition-colors rounded-full hover:bg-green-100" aria-label="Inicio">
          <Home size={24} className="text-green-800 sm:size-5 md:size-6" />
        </Link>
      </div>
    </header>
  );
}