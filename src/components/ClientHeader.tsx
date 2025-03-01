'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Title from '@/components/Title';

export default function ClientHeader() {
  const pathname = usePathname();
  
  // No mostrar el header en páginas de propietario
  if (pathname?.includes('/propietario')) {
    return null;
  }
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto py-4 flex justify-center items-center">
        <Link href="/" className="inline-block">
          <Title text="OSUCOMPOST" />
        </Link>
      </div>
    </header>
  );
}