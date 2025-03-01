"use client";
import { useState } from "react";
import Title from "@/components/Title";
import Link from "next/link";
import  RegisterFormDos  from "@/components/RegisterForm/RegisterFormDos"; // Importación actualizada
import LoginForm from "@/components/login/LoginForm";

export default function AreaCliente() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <header className="bg-white shadow-md py-4 fixed top-0 w-full z-50">
        <div className="text-center">
          <Link href="/">
            <Title text="OSUCOMPOST" />
          </Link>
        </div>
      </header>

      <div
        className="fixed inset-0 w-full h-screen bg-cover bg-center bg-no-repeat filter blur-sm opacity-75"
        style={{
          backgroundImage: "url(/images/userZone.jpg)",
        }}
      ></div>

      <div className="pt-20 flex justify-center items-center">
        <div className="bg-white/50 backdrop-blur-sm p-8 rounded-lg shadow-xl w-full max-w-md">
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