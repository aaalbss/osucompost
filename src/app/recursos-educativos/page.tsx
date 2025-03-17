"use client";

import React from 'react';
import VideoPlayer from '@/components/recursos-educativos/VideoPlayer';
import ViedoPlayerEnlace from '@/components/recursos-educativos/VideoPlayerEnlace';
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
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#2f4f27] mb-6">Vídeos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            <VideoPlayer 
              videoUrl="/videos/video3_osucompost.mp4"
              posterUrl="/images/portada_3.png"
              autoPlay={false}
              loop={false}
              muted={false}
            />

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

            <ViedoPlayerEnlace 
              videoUrl="https://www.facebook.com/plugins/video.php?height=373&href=https%3A%2F%2Fwww.facebook.com%2Fmolinoverdepiura%2Fvideos%2F444871877289359%2F&show_text=false&width=560&t=0"
              thumbnailUrl="/images/portada_4.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}