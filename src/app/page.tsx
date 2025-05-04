"use client";

import { useState, useEffect } from "react";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import WhyUsSection from "@/components/WhyUsSection";
import RewardSection from "@/components/RewardSection";
//import GallerySection from "@/components/GallerySection";
import ProductsSection from "@/components/ProductsSection";
import ContactSection from "@/components/ContactSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import AboutSection from "@/components/AboutSection";
//import ProcesoReciclado from "@/components/ProcesoReciclado";
//import ProcesoRecicladoDiagram from "@/components/ProcesoRecicladoDiagram";
import Chatbot from "@/components/ChatBot";
//import GlitchText from "@/components/GlitchText";
import "leaflet/dist/leaflet.css";
import "./globals.css";
//import Calendar3D from "@/components/Calendar3D";
//import ScrollRevealText from "@/components/ScrollRevealText";
//import ModeloNegocio from "@/components/ModeloNegocio";
import OsucompostProcess from "@/components/OsucompostProcess";
import SuccessModal from "@/components/SuccessModal";
import SessionCleaner from "@/components/SessionCleaner";

//import Info from "@/components/Info";
import ScrollTransition from "@/components/ScrollTransiton";

// Componente que utiliza useSearchParams dentro de Suspense
function SearchParamsComponent() {
  const searchParams = useSearchParams();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Esta función verifica los parámetros de URL y muestra el modal si es necesario
  const checkUrlParams = () => {
    // Verificar si el usuario viene de eliminar su cuenta
    const mensajeParam = searchParams?.get("mensaje");
    
    console.log("Parámetro mensaje:", mensajeParam);
    
    if (mensajeParam === "cuenta-eliminada") {
      console.log("Mostrando modal de cuenta eliminada");
      setModalMessage(
        "Su cuenta ha sido dada de baja con éxito. Todos sus datos han sido eliminados correctamente."
      );
      setShowModal(true);

      // Limpiar el parámetro de la URL para evitar que se muestre de nuevo al refrescar
      if (typeof window !== "undefined") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    }
  };

  // Ejecutar la verificación tan pronto como se cargue la página
  useEffect(() => {
    // Pequeño retraso para asegurar que los parámetros estén disponibles
    const timer = setTimeout(() => {
      checkUrlParams();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <SuccessModal
          isOpen={showModal}
          message={modalMessage}
          onClose={closeModal}
        />
      )}
    </>
  );
}

const HomePage = () => {
  return (
    <div className="relative min-h-screen">
      {/* Componente para limpiar sesiones de operarios */}
      <SessionCleaner />
      
      {/* Fondo con gradiente fijo */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-white via-[#E8EFE2] to-white"></div>

      {/* Contenido de la página */}
      <div className="relative z-10">
        <Header />
        <main className="min-h-screen">
          {/* Agregar Suspense alrededor del componente que usa useSearchParams */}
          <Suspense fallback={<div>Cargando...</div>}>
            <SearchParamsComponent />
          </Suspense>

          <HeroSection />

          <ScrollTransition>
            <AboutSection />
          </ScrollTransition>

          {/* <GlitchText text="Proceso de Reciclado" /> */}
          {/*<Calendar3D />*/}
          {/*<ScrollRevealText />*/}
          {/*   <ProcesoRecicladoDiagram />*/}

          <ScrollTransition>
            <OsucompostProcess />
          </ScrollTransition>

          <ScrollTransition>
            <WhyUsSection />
          </ScrollTransition>

          {/*<GallerySection />*/}

          <ScrollTransition>
            <RewardSection />
          </ScrollTransition>

          <ScrollTransition>
            <ProductsSection />
          </ScrollTransition>

          {/*   <ScrollTransition>
       <ProcesoReciclado />
        </ScrollTransition> */}

          {/* <ModeloNegocio  />*/}

          {/*  <Info /> */}

          <ScrollTransition>
            <MapSection />
          </ScrollTransition>

          <ScrollTransition>
            <ContactSection />
          </ScrollTransition>

          <div style={{ padding: "20px" }}>
            <Chatbot />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;