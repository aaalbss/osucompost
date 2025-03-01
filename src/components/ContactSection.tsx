import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Teléfono",
      content: "+34 616 86 37 36",
      description: "LLamanos o envíanos un mensaje"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      content: "osucompost@gmail.com",
      description: "Respuesta en 24h"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Dirección",
      content: "Cerro Buenos Aires, Osuna (Sevilla)",
      description: "Polígono 134, Parcela 17"
    }
  ];

  return (
    <section id="contact" className="py-12 ">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-green-800 mb-3">
            Contacta con nosotros
          </h2>
          <div className="w-20 h-1 bg-green-800 mx-auto rounded-full mb-4"></div>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Estamos aquí para resolver tus dudas y ayudarte en todo lo que necesites
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {contactInfo.map((info, index) => (
            <div
              key={index}
              className="bg-white/30 p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="bg-green-800 p-3 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                  {info.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-2 text-lg">
                    {info.title}
                  </h3>
                  <p className="text-gray-700 font-medium mb-1">
                    {info.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {info.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;