import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

const EnlacesComponent = () => {
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  
  const enlaces = [
    {
      titulo: "Formulario bares y restaurantes adheridos",
      descripcion: "Completa nuestro formulario para bares y restaurantes adheridos",
      url: "https://docs.google.com/forms/d/e/1FAIpQLSe4B7VhWNjTeBuCPLMP7AfYaIGDAsWKkT3GlzPk6NdYJUjC3Q/viewform"
    },
    {
      titulo: "Web con más información",
      descripcion: "Descubre más sobre nuestros servicios",
      url: "https://sites.google.com/g.educaand.es/osucompost/inicio"
    },
    {
      titulo: "Plan de empresa",
      descripcion: "Descubre nuestro plan de empresa",
      url: "/pdfs/PLAN_EMPRESA_OSUCOMPOST.pdf"
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-light text-green-800 mb-10 text-center">Enlaces de <span className="font-medium border-b-2 border-green-600 pb-1">Interés</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {enlaces.map((enlace, index) => (
          <a 
            key={index}
            href={enlace.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-white rounded-lg p-6 transition-all duration-500 hover:shadow-md"
            onMouseEnter={() => setHoveredLink(index)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            {/* Borde sutil con esquina decorativa */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-green-50 rounded-bl-3xl rounded-tr-lg transition-all duration-300 group-hover:bg-green-100" />
            
            <div className="relative z-10">
              <h3 className="text-xl font-medium text-green-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                {enlace.titulo}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4 font-light">
                {enlace.descripcion}
              </p>
              
              <div className="flex items-center text-green-700 text-sm font-medium opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <span className="mr-2">Visitar</span>
                <ArrowRight 
                  size={16}
                  className={`transform transition-all duration-500 ${
                    hoveredLink === index ? 'translate-x-1' : ''
                  }`}
                />
              </div>
            </div>
            
            {/* Línea decorativa inferior */}
            <div 
              className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-green-600 to-green-400 transition-all duration-700 ease-in-out ${
                hoveredLink === index ? 'w-full' : 'w-0'
              }`}
            />
          </a>
        ))}
      </div>
      
      {/* Decoración visual más sutil */}
      <div className="mt-16 flex justify-center">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-60" />
      </div>
    </div>
  );
};

export default EnlacesComponent;