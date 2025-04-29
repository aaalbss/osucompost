"use client";
import RegisterFormTres from "@/components/RegisterForm/RegisterFormTres"; 
import Link from "next/link";
import Image from "next/image";
import Title from "@/components/Title";
import { Home } from "lucide-react";

export default function NuevaRecogida() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-[#f0f4f8]">
            {/* Background image with blur effect - positioned below header */}
            <div className="fixed top-[56px] inset-x-0 bottom-0 w-full opacity-75 filter blur-sm">
                <Image
                    src="/images/nuevarecogida2.png"
                    alt="Fondo de nueva recogida"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center top' }}
                    priority
                    quality={85}
                />
            </div>
            
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
            
            {/* Main content - left positioned with equal vertical margins */}
            <main className="relative z-10 flex items-center justify-start min-h-screen py-16 pl-8 md:pl-16 lg:pl-24">
                <div className="w-full max-w-md p-6 mx-4 rounded-lg shadow-xl bg-white/50 backdrop-blur-sm">
                    <h1 className="mb-6 text-2xl font-bold text-center text-[#2f4f27]">Registrar Nuevo Contenedor</h1>
                    <RegisterFormTres />
                </div>
            </main>
        </div>
    );
}