"use client";

//import { Recycle } from 'lucide-react'; // Importa Recycle correctamente

const VerMiDescription = () => {
  return (
    <section id="about" className="py-16">
      <div className="container mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-green-800 mb-8 flex items-center justify-center">
          ¿Por que monitorizamos nuestras composteras? 
          {/* <Recycle size={32} className="ml-2 text-[#2f4f27]" />*/}
        </h3>
        <p className="text-lg  mb-6 text-justify ">
		Controlar las variables de humedad y temperatura en una compostera es fundamental para garantizar un 
		proceso de compostaje eficiente y saludable. La humedad adecuada (entre el 60% y 80%) es crucial para 
		mantener un ambiente óptimo para las lombrices, ya que un exceso de agua puede provocar falta de oxígeno
		y malos olores, mientras que un nivel insuficiente puede deshidratarlas y ralentizar la descomposición de 
		la materia orgánica. Por otro lado, la temperatura (idealmente entre 15°C y 25°C) influye directamente en 
		la actividad de las lombrices y los microorganismos responsables del compostaje. Temperaturas demasiado altas 
		pueden matar a las lombrices, y temperaturas bajas pueden ralentizar su metabolismo. Mantener estas variables 
		bajo control no solo asegura la supervivencia y productividad de las lombrices, sino que también acelera la 
		producción de compost de alta calidad, rico en nutrientes y libre de patógenos.
        </p>
      </div>
    </section>
  );
};

export default VerMiDescription;