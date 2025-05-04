import React from 'react';
import { Leaf, Droplet, Worm } from 'lucide-react';

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
    icon: <Worm className="w-8 h-8" />,
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
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-green-800">
            Nuestros Productos
          </h2>
          <div className="w-24 h-1 mx-auto mb-6 bg-green-800 rounded-full"></div>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            Productos de alta calidad para agricultura ecológica, resultado de nuestra gestión sostenible de residuos orgánicos
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={index}
              className="overflow-hidden transition-all duration-300 transform shadow-lg group rounded-xl hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-full h-2 bg-green-800"></div>
              
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center justify-center w-16 h-16 transition-transform duration-300 rounded-full bg-green-50 group-hover:scale-110">
                    <div className="text-green-800 transition-transform duration-300 group-hover:rotate-12">
                      {product.icon}
                    </div>
                  </div>
                </div>

                <h3 className="mb-3 text-2xl font-bold text-green-800">
                  {product.title}
                </h3>

                <p className="mb-6 text-sm text-gray-600">
                  {product.description}
                </p>

                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-sm">
                      <span className="mt-1 text-green-800">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 mt-4 bg-green-50">
                <a 
                  href="#contact" 
                  className="block w-full py-3 font-semibold text-center text-white transition-colors duration-300 bg-green-800 rounded-lg hover:bg-green-700"
                >
                  Solicitar Información
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;