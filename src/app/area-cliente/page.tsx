"use client";
import { useState } from "react";
import Title from "@/components/Title";
import Link from "next/link";
import Image from "next/image";
import RegisterFormDos from "@/components/RegisterForm/RegisterFormDos";
import LoginForm from "@/components/login/LoginForm";
import { Home } from "lucide-react";

export default function AreaCliente() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f4f8]">
      {/* Fixed header */}
      <header className="fixed top-0 z-50 w-full py-3 bg-white shadow-md backdrop-blur-sm">
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

      {/* Background image with blur effect - positioned below header */}
      <div className="fixed top-[56px] inset-x-0 bottom-0 w-full opacity-75 filter blur-sm">
        <Image
          src="/images/areacliente.png"
          alt="Background"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
          priority
          quality={85}
        />
      </div>
      
      {/* Content container */}
      <main className="relative z-10 flex items-start justify-center min-h-screen pt-16 md:justify-end md:pr-72 lg:pr-72">
        <div className="w-full max-w-md p-5 mx-4 rounded-lg shadow-xl bg-white/50 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-3 text-center text-[#2f4f27]">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h2>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterFormDos onRegisterSuccess={() => setIsLogin(true)} />
          )}

          <p className="mt-2 text-sm text-center text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#3b6e35] hover:underline"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}