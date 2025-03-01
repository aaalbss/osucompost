import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const sections = [
  {
    title: "Promoción del Compost y Biogás",
    content:
      "Las autoridades fomentan el uso del compost y el biogás para agricultura, jardinería y regeneración ambiental, reduciendo el uso de fertilizantes minerales y aprovechando el biogás para energía o transporte.",
    icon: "🌱",
  },
  {
    title: "Principio de 'Quien Contamina Paga'",
    content:
      "Según la normativa, los costos de gestión de residuos deben ser asumidos por los productores de residuos, promoviendo la responsabilidad ambiental. Este principio está incluido en el artículo 11 de la normativa vigente.",
    icon: "⚖️",
  },
  {
    title: "Recogida Separada Remunerada",
    content:
      "Este proyecto analiza la viabilidad de un servicio donde los usuarios sean recompensados económicamente por la separación de sus residuos orgánicos.",
    icon: "💰",
  },
  {
    title: "Vermicompostaje: Compostaje con Lombrices",
    content:
      "El vermicompostaje con lombrices rojas de California transforma la materia orgánica en un abono natural, reduciendo plagas y mejorando la calidad del suelo. Este proceso es ideal para hogares con espacio reducido.",
    icon: "🐛",
  },
];

export default function Info() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    // Si la tarjeta ya está abierta, la cerramos, si no, la abrimos
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <h2 className="text-3xl font-extrabold text-center text-green-700 mb-8">Proyectos Ambientales</h2>
      <div className="flex justify-between gap-6 mb-8">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-300 ease-in-out flex-1 hover:bg-green-100"
          >
            <div
              className="flex items-center justify-between cursor-pointer p-6 hover:bg-green-100 transition-all duration-200"
              onClick={() => toggleSection(index)} // Al hacer clic, la tarjeta se expande o colapsa
            >
              <span className="text-3xl">{section.icon}</span>
              <h3 className="text-xl font-semibold text-green-700 flex-grow">{section.title}</h3>
              {openIndex === index ? (
                <ChevronUp className="text-green-700" />
              ) : (
                <ChevronDown className="text-green-700" />
              )}
            </div>

            {/* No mostramos la información dentro de la tarjeta, solo expandimos/cerramos la tarjeta */}
          </div>
        ))}
      </div>

      {/* Mostrar la información debajo de las tarjetas */}
      <div className="mt-8">
        {openIndex !== null && (
          <div className="bg-green-50 p-6 rounded-lg shadow-md text-gray-800">
            <h3 className="text-xl font-semibold text-green-700">{sections[openIndex].title}</h3>
            <p className="mt-4">{sections[openIndex].content}</p>
          </div>
        )}
      </div>
    </div>
  );
}
