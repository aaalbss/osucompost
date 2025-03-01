import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Recycle, Globe, Users } from 'lucide-react';

interface ReasonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ReasonCard: React.FC<ReasonCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      className="group relative bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 w-full max-w-[350px] mx-auto"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-14 h-14 bg-[#1B5E20] rounded-full flex items-center justify-center text-white group-hover:scale-105 transition-all duration-200">
        <Icon size={24} />
      </div>

      <div className="mt-10 space-y-3 text-center">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#1B5E20] transition-colors duration-200">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-800 transition-colors duration-200">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const WhyUs: React.FC = () => {
  return (
    <div className="py-16 bg-white"> {/* Fondo más suave para contraste */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-800 relative inline-block"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            ¿Por qué OSUCOMPOST?
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#1B5E20] transform -skew-x-12"></div>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-center">
          {[
            {
              icon: Recycle,
              title: "Sostenibilidad Ambiental",
              description:
                "Transformamos residuos orgánicos en compost de alta calidad. Nuestro proceso reduce emisiones y evita la acumulación de desechos, ayudando a regenerar los suelos.",
            },
            {
              icon: Globe,
              title: "Fomento de la Economía Circular",
              description:
                "Reciclamos residuos y los convertimos en fertilizante orgánico. Contribuimos a un modelo sostenible donde los desechos se convierten en recursos valiosos.",
            },
            {
              icon: Users,
              title: "Compromiso con la Comunidad",
              description:
                "Ofrecemos un servicio de recogida de residuos puerta a puerta, facilitando la participación ciudadana y promoviendo una cultura ecológica en Osuna y sus alrededores.",
            },
          ].map((reason, index) => (
            <ReasonCard
              key={index}
              icon={reason.icon}
              title={reason.title}
              description={reason.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUs;
