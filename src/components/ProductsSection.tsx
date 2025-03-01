import React from 'react';
import { Leaf, Droplet, Bug } from 'lucide-react';

const products = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Humus Sólido",
    description: "Fertilizante natural de alta calidad para agricultura ecológica y jardinería",
    features: [
      "Alta porosidad y capacidad de retención de agua",
      "Rico en N, P, K, Ca y Mg disponibles para plantas",
      "Protección natural contra plagas y enfermedades",
      "Mejora la estructura y fertilidad del suelo",
      "10% de rendimiento sobre residuo fresco",
      "Certificado para agricultura ecológica"
    ]
  },
  {
    icon: <Droplet className="w-8 h-8" />,
    title: "Humus Líquido",
    description: "Extracto líquido concentrado para fertilización foliar y riego",
    features: [
      "Alta concentración de nutrientes biodisponibles",
      "Rápida absorción por parte de la planta",
      "Rico en hormonas de crecimiento naturales",
      "Ideal para cultivos intensivos",
      "30% de rendimiento sobre material procesado",
      "Aplicación fácil mediante riego o pulverización"
    ]
  },
  {
    icon: <Bug className="w-8 h-8" />,
    title: "Lombriz Viva",
    description: "Eisenia foetida (Lombriz Roja Californiana) para múltiples usos",
    features: [
      "Ideal para vermicompostaje doméstico",
      "Alimento premium para aves de corral",
      "Excelente cebo para pesca deportiva",
      "Alta capacidad reproductiva",
      "Producción de 1kg por cada 40kg procesados",
      "Ejemplares seleccionados y saludables"
    ]
  }
];

const ProductsSection = () => {
  return (
    <section id="products" className="py-24 ">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-green-800 mb-4">
            Nuestros Productos
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Productos de alta calidad para agricultura ecológica, resultado de nuestra gestión sostenible de residuos orgánicos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
            >
              <div className="h-2 bg-green-800 w-full"></div>
              
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <div className="text-green-800 group-hover:rotate-12 transition-transform duration-300">
                      {product.icon}
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-green-800 mb-3">
                  {product.title}
                </h3>

                <p className="text-gray-600 mb-6 text-sm">
                  {product.description}
                </p>

                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <span className="text-green-800 mt-1">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 bg-green-50 mt-4">
                <button className="w-full bg-green-800 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                  Solicitar Información
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;