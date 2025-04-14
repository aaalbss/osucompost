"use client";
import { useState } from "react";
import Title from "@/components/Title";
import Link from "next/link";
import RegisterFormDos from "@/components/RegisterForm/RegisterFormDos"; 
import LoginForm from "@/components/login/LoginForm";
import { Home } from "lucide-react";

export default function AreaCliente() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <header className="fixed top-0 z-50 w-full py-4 bg-white shadow-md">
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

      <div
        className="fixed inset-0 w-full h-screen bg-center bg-no-repeat bg-cover opacity-75 filter blur-sm"
        style={{
          backgroundImage: "url(/images/areacliente.png)",
        }}
      ></div>

      <div className="flex items-center justify-center pt-20">
        <div className="w-full max-w-md p-8 rounded-lg shadow-xl bg-white/50 backdrop-blur-sm">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#2f4f27]">
            {isLogin ? "Iniciar Sesión" : "Registrarse"}
          </h2>

          {isLogin ? (
            <LoginForm />
          ) : (
            <RegisterFormDos onRegisterSuccess={() => setIsLogin(true)} />
          )}

          <p className="mt-4 text-center text-gray-600">
            {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-[#3b6e35] hover:underline"
            >
              {isLogin ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}