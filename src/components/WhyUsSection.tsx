import React from 'react';
import { BiLeaf } from "react-icons/bi";
import { GiRecycle } from "react-icons/gi";
import { PiUsersThree } from "react-icons/pi";

const principles = [
  {
    icon: <BiLeaf className="text-green-800" />,
    title: "Sostenibilidad Ambiental",
    description:
      "Transformamos residuos orgánicos en compost de alta calidad. Nuestro proceso reduce emisiones y evita la acumulación de desechos, ayudando a regenerar los suelos.",
  },
  {
    icon: <GiRecycle className="text-green-800" />,
    title: "Fomento de la Economía Circular",
    description:
      "Reciclamos residuos y los convertimos en fertilizante orgánico. Contribuimos a un modelo sostenible donde los desechos se convierten en recursos valiosos.",
  },
  {
    icon: <PiUsersThree className="text-green-800" />,
    title: "Compromiso con la Comunidad",
    description:
      "Ofrecemos un servicio de recogida de residuos puerta a puerta, facilitando la participación ciudadana y promoviendo una cultura ecológica en Osuna y sus alrededores.",
  },
];

const WhyUsSection = () => {
  return (
    <section className="py-24 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            ¿Por qué OSUCOMPOST?
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="group relative backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute inset-0 bg-green-800 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
              
              <div className="p-8">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-green-600/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-3xl text-green-800 group-hover:rotate-12 transition-transform duration-300">
                      {principle.icon}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-green-800 mb-4 group-hover:text-green-800/80 transition-colors duration-300">
                  {principle.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {principle.description}
                </p>
              </div>
              
              <div className="h-1 w-0 bg-green-800 group-hover:w-full transition-all duration-500 ease-out"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;