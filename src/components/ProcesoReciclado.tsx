import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

interface ProcesoEtapa {
  titulo: string;
  descripcion: string;
  color: string;
}

const ETAPAS: ProcesoEtapa[] = [
  {
    titulo: "1. Recepción de materia prima",
    descripcion: `
      🔴 <b>Área de recepción de biorresiduos:</b> Los residuos orgánicos provenientes de distintas fuentes (hogares, restaurantes, mercados, etc.) llegan a esta zona. 
      Aquí se realiza un primer control visual para descartar elementos no orgánicos evidentes.<br><br>
      🟡 <b>Recepción de restos vegetales:</b> Materiales como ramas, hojas y restos de poda son recolectados y almacenados temporalmente en esta área antes de su procesamiento.
    `,
    color: "bg-red-500",
  },
  {
    titulo: "2. Preparación de los materiales",
    descripcion: `
      ⚪ <b>Triaje y adecuación:</b> Se lleva a cabo una clasificación de los residuos para eliminar materiales impropios (plásticos, metales u otros desechos no compostables). La fracción orgánica seleccionada se prepara para el siguiente paso.<br><br>
      ⚪ <b>Trituración:</b> Los restos vegetales voluminosos se trituran en partículas más pequeñas para facilitar su descomposición y mejorar la eficiencia del compostaje.<br><br>
      🟢 <b>Material estructurante:</b> Este material, compuesto principalmente por restos vegetales triturados, se utiliza para mejorar la estructura del compost. Facilita la aireación y mantiene la humedad adecuada.<br><br>
    `,
    color: "bg-gray-500",
  },
  {
    titulo: "3. Formación de la mezcla",
    descripcion: `
      🔄 <b> Mezcla de fracción orgánica y material estructurante:</b> Se combinan los residuos orgánicos con el material estructurante en proporciones adecuadas. Esto equilibra la relación carbono-nitrógeno y garantiza un compostaje eficiente.
    `,
    color: "bg-green-600",
  },
  {
    titulo: "4. Compostaje",
    descripcion: `
      🟢 <b>Área de compostaje:</b> El material mezclado es depositado en pilas o reactores donde se inicia la descomposición. Los microorganismos degradan la materia orgánica, generando calor y transformándola en compost. Este proceso debe ser monitoreado para asegurar la correcta aireación, humedad y temperatura.<br><br>
      🔄 <b>Alimentación continua:</b> Se incorporan nuevos residuos orgánicos de manera regular para mantener el proceso activo y evitar interrupciones en la biodegradación.
    `,
    color: "bg-yellow-500",
  },
  {
    titulo: "5. Vermicompostaje",
    descripcion: `
      🟤 <b>Área de vermicompostaje:</b> En esta etapa, el compost preprocesado es introducido en sistemas con lombrices (como Eisenia foetida, lombriz roja californiana). Estas lombrices se alimentan de la materia orgánica y la transforman en humus de alta calidad.<br><br>
      🟡 <b>Pie de siembra:</b> Se introducen lombrices y microorganismos del área de cría para acelerar el proceso de descomposición biológica.
    `,
    color: "bg-green-300",
  },
  {
    titulo: "6. Recolección y Maduración",
    descripcion: `
      🔄 <b>Recolección:</b> Una vez que las lombrices han procesado la materia, el humus resultante es recolectado cuidadosamente para evitar eliminar las lombrices en exceso.<br><br>
      🟢 <b>Área de maduración:</b> El humus es almacenado para su estabilización final. En esta fase, los microorganismos continúan su actividad, asegurando que el producto final esté libre de agentes patógenos y sea adecuado para su uso.<br><br>
      🔵 <b>Afinado:</b> El humus se tamiza para eliminar partículas grandes o restos no procesados, obteniendo un producto más homogéneo.
    `,
    color: "bg-blue-500",
  },
  {
    titulo: "7. Obtención de productos finales",
    descripcion: `
      🟣 <b>Humus sólido:</b> El producto final, rico en nutrientes y microorganismos beneficiosos, está listo para su uso como fertilizante orgánico en suelos agrícolas y jardines.<br><br>
      🔴 <b>Humus líquido:</b> Se extrae un concentrado líquido con alta carga de nutrientes, utilizado como biofertilizante para riego o en cultivos hidropónicos.
    `,
    color: "bg-pink-500",
  },
  {
    titulo: "8. Almacenamiento y recirculación",
    descripcion: `
      🟢 <b>Área de almacenamiento:</b> El humus sólido y líquido se almacenan en condiciones adecuadas hasta su distribución o venta.<br><br>
      🟡 <b>Fracción recirculada:</b> Algunas partes del compost en formación pueden ser reintroducidas en el proceso para optimizar su calidad o acelerar la biodegradación.<br><br>
      🟡 <b>Área de cría:</b> Aquí se mantiene una población de lombrices en condiciones óptimas para garantizar la continuidad del vermicompostaje.
    `,
    color: "bg-yellow-500",
  },
  {
    titulo: "Gestión de residuos y subprocesos",
    descripcion: `
      ⚫ <b>Lixiviados:</b> Líquidos generados en el proceso que contienen nutrientes disueltos. Dependiendo de su composición, pueden ser reutilizados en el compostaje o gestionados como residuo.<br><br>
      🔵 <b>Aguas pluviales:</b> Es importante controlar el agua de lluvia para evitar que altere la humedad del compost y afecte su descomposición. Se pueden implementar sistemas de captación y drenaje.<br><br>
      ⚫ <b>Rechazo:</b> Materiales no compostables que fueron descartados en las primeras fases y deben ser gestionados correctamente.
    `,
    color: "bg-gray-500",
  },
];

const ProcesoReciclado: React.FC = () => {
    const [etapaSeleccionada, setEtapaSeleccionada] = useState<ProcesoEtapa | null>(null);
  
    const seleccionarEtapa = (etapa: ProcesoEtapa) => {
      setEtapaSeleccionada(etapa);
    };
  
    const cerrarDescripcion = () => {
      setEtapaSeleccionada(null);
    };
  
    useEffect(() => {
      if (etapaSeleccionada) {
        gsap.fromTo(
          ".descripcion-etapa",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.5 }
        );
      }
    }, [etapaSeleccionada]);
  
    useEffect(() => {
      gsap.fromTo(
        ".imagen-proceso",
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1 }
      );
    }, []);
  
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Columna izquierda: Tarjetas y descripción */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Cuadrícula de etapas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ETAPAS.map((etapa, index) => (
                <div
                  key={index}
                  className="p-3 text-center rounded-lg cursor-pointer transform transition-all 
                           hover:scale-105 bg-green-50 border-2 border-green-800 
                           flex items-center justify-center text-black font-semibold 
                           text-sm sm:text-base min-h-[80px]"
                  onClick={() => seleccionarEtapa(etapa)}
                >
                  {etapa.titulo}
                </div>
              ))}
            </div>
  
            {/* Descripción de la etapa seleccionada */}
            {etapaSeleccionada && (
              <div className="descripcion-etapa bg-white/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg 
                            max-h-[60vh] overflow-y-auto">
                <div className="flex justify-between items-start gap-4">
                  <h2 className="text-lg sm:text-xl font-bold">{etapaSeleccionada.titulo}</h2>
                  <button 
                    onClick={cerrarDescripcion} 
                    className="text-gray-600 hover:text-gray-900 text-xl p-2"
                  >
                    ✕
                  </button>
                </div>
                <div 
                  className="mt-4 text-sm sm:text-base space-y-2" 
                  dangerouslySetInnerHTML={{ __html: etapaSeleccionada.descripcion }} 
                />
              </div>
            )}
          </div>
  
          {/* Columna derecha: Imagen */}
          <div className="w-full lg:w-1/2 mt-6 lg:mt-0">
            <div className="imagen-proceso relative w-full h-[300px] sm:h-[400px] lg:h-[500px]">
              <Image 
                src="/images/proceso_reciclado.png" 
                alt="Proceso de Compostaje" 
                fill
                className="rounded-lg shadow-lg object-contain transition-transform 
                         duration-500 transform hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProcesoReciclado;