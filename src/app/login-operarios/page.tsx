import React from 'react';
import Link from 'next/link';
import LoginFormDos from '@/components/login/LoginFormDos';
import Title from '@/components/Title';
import { Home } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-100">
      {/* Background image with blur effect */}
      <div
        className="fixed inset-0 w-full h-full bg-center bg-no-repeat bg-cover opacity-75 filter blur-sm"
        style={{
          backgroundImage: "url('/images/operarios.jpg')",
        }}
      ></div>
      
      {/* Fixed header */}
      <header className="fixed top-0 z-50 w-full py-3 shadow-md bg-white/90">
        <div className="container flex items-center justify-between px-4 mx-auto">
          <div className="flex justify-center flex-1">
            <Link href="/">
              <Title text="OSUCOMPOST" />
            </Link>
          </div>
          <Link 
            href="/" 
            className="p-2 transition-colors rounded-full hover:bg-green-100"
            aria-label="Ir a página principal"
          >
            <Home size={24} className="text-green-800" />
          </Link>
        </div>
      </header>
      
      {/* Content container */}
      <main className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 mx-4 rounded-lg shadow-lg bg-white/75 backdrop-blur-sm">
          <h1 className="mb-6 text-2xl font-bold text-center text-green-800">
            Iniciar Sesión
          </h1>
          <LoginFormDos />
        </div>
      </main>
    </div>
  );
}
