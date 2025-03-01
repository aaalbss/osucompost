"use client";

import React from 'react';
import VideoPlayer from '@/components/recursos-educativos/VideoPlayer';
import EnlacesComponent from '@/components/recursos-educativos/EnlacesComponent';
import VisorImagen from '@/components/recursos-educativos/VisorImage';

export default function VideoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#E8EFE2] to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-[#2f4f27] sm:text-4xl">
            Recursos Educativos
          </h1>
        </div>

        <div className="mb-16">
          <EnlacesComponent />
        </div>

        <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#2f4f27]">¿Qué residuos son aptos?</h2>
          <VisorImagen />
        </div>

        {/* Sección de Videos */}
        <div className="mb-16 space-y-8">
          <h2 className="text-2xl font-bold text-[#2f4f27]">Vídeos</h2>

          <VideoPlayer 
            videoUrl="/videos/anuncio_publicitario.MOV"
            posterUrl="/images/portada_1.png"
            autoPlay={false}
            loop={false}
            muted={false}
          />

          <VideoPlayer 
            videoUrl="/videos/video2_osucompost.mp4"
            posterUrl="/images/portada_2.png"
            autoPlay={false}
            loop={false}
            muted={false}
          />

            <VideoPlayer 
            videoUrl="/videos/video3_osucompost.mp4"
            posterUrl="/images/portada_3.png"
            autoPlay={false}
            loop={false}
            muted={false}
          />
        </div>
      </div>
    </div>
  );
}
