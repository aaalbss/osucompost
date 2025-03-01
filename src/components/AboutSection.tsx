"use client";

//import { Recycle } from 'lucide-react'; // Importa Recycle correctamente

const AboutSection = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-green-800 mb-8 flex items-center justify-center">
          Sobre Nosotros 
          {/* <Recycle size={32} className="ml-2 text-[#2f4f27]" />*/}
        </h3>
        <p className="text-lg  mb-6 text-center">
          OSUCOMPOST es una empresa innovadora en Osuna dedicada a la gestión sostenible de residuos orgánicos mediante el proceso de vermicompostaje.
          Nuestro sistema de recogida puerta a puerta y procesamiento de residuos nos permite crear fertilizantes de alta calidad para la agricultura ecológica, recompensando el compromiso ambiental de nuestra comunidad.
          Nos esforzamos diariamente para promover prácticas responsables de reciclaje y compostaje, contribuyendo a un futuro más sostenible.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;