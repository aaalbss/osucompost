import React from 'react';
import Link from 'next/link';
import { Gift, Recycle, CalendarClock, CreditCard } from 'lucide-react';

const RewardSection = () => {
  const steps = [
    {
      icon: <Recycle className="w-6 h-6" />,
      text: "Separa tus residuos orgánicos"
    },
    {
      icon: <CalendarClock className="w-6 h-6" />,
      text: "Programa la recogida desde nuestra web"
    },
    {
      icon: <Gift className="w-6 h-6" />,
      text: "Acumula puntos por cada kg entregado"
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      text: "Canjea tus puntos"
    }
  ];

  return (
    <section id="reward" className="py-20 bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Programa de Recogida puerta a puerta
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Contribuye al medio ambiente mientras ganas recompensas por tu compromiso con el reciclaje
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* How it works section */}
          <div className="group bg-white/30 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8">
            <h3 className="text-2xl font-bold text-green-800 mb-8 flex items-center">
              ¿Cómo funciona?
            </h3>
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <div 
                  key={index}
                  className="flex items-center p-4 bg-green-800/5 rounded-lg group-hover:translate-x-2 transition-transform duration-300"
                >
                  <div className="bg-green-800 p-2 rounded-full text-white mr-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <span className="text-gray-700">{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign up section */}
          <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col justify-center items-center">            
            <div className="text-center">
              <h3 className="text-3xl font-bold text-green-800 mb-6">
                ¡Únete ahora y empieza a ganar!
              </h3>
              <p className="text-gray-600 mb-8 text-lg">
                Transforma tus residuos en recompensas y ayuda al planeta
              </p>
              <Link href="/area-cliente">
                <button className="bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-800/90 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Comenzar ahora
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RewardSection;