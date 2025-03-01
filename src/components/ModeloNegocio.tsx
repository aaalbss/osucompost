import React, { useState, ReactNode } from 'react';
import {
  School, Home, UtensilsCrossed, Truck, Recycle,
  ShoppingBag, Trees, Smartphone, Globe, Building2,
  LucideIcon
} from 'lucide-react';
//import Image from 'next/image';

interface ProcessSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

interface ProcessStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
  isActive?: boolean;
  className?: string;
}

interface ProcessingStepProps {
  title: string;
  description: string;
  isActive: boolean;
}

const ProcessSection = ({ title, children, className = '' }: ProcessSectionProps) => (
  <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
    <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
    {children}
  </div>
);

const ProcessStep = ({ icon: Icon, title, description, onClick, isActive, className = '' }: ProcessStepProps) => (
  <div 
    className={`
      flex flex-col items-center p-4 rounded-lg 
      ${isActive ? 'bg-green-100' : 'bg-white'} 
      shadow-md transition-all duration-300 hover:scale-105 cursor-pointer
      ${className}
    `}
    onClick={onClick}
  >
    <Icon className={`w-8 h-8 mb-2 ${isActive ? 'text-green-600' : ''}`} />
    <h3 className="font-semibold text-lg mb-1">{title}</h3>
    <p className="text-sm text-gray-600 text-center">{description}</p>
  </div>
);

const ProcessingStep = ({ title, description, isActive }: ProcessingStepProps) => (
  <div className={`
    p-4 rounded-lg shadow transition-all duration-300
    ${isActive ? 'bg-green-100 scale-105' : 'bg-white'}
  `}>
    <h3 className="font-semibold mb-2">{title}</h3>
    <p className="text-sm">{description}</p>
  </div>
);

const ModeloNegocio = () => {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showProcessingDetails, setShowProcessingDetails] = useState(false);

  const handleStepClick = (step: string) => {
    setActiveStep(activeStep === step ? null : step);
  };

  const toggleProcessingDetails = () => {
    setShowProcessingDetails(!showProcessingDetails);
  };

  const processingSteps = [
    {
      title: "Recepción de Biorresiduos",
      description: "Área especializada para la recepción y clasificación inicial de residuos orgánicos"
    },
    {
      title: "Triaje y Adecuación",
      description: "Separación de impropios y preparación de la fracción orgánica"
    },
    {
      title: "Área de Compostaje",
      description: "Proceso controlado de descomposición con alimentación continua"
    },
    {
      title: "Vermicompostaje",
      description: "Tratamiento mediante lombrices para mejorar la calidad del compost"
    },
    {
      title: "Maduración",
      description: "Fase final donde el compost alcanza su estabilidad óptima"
    },
    {
      title: "Control de Calidad",
      description: "Verificación de parámetros y certificación del producto final"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">OSUCOMPOST</h1>
        <p className="text-xl text-gray-600">Nuestro modelo de negocio</p>
      </div>

      {/* Schema Image */}
      {/*<div className="mb-12">
        <Image
          src="/images/esquema_general.png" 
          alt="Esquema General del Proceso" 
          
          width={800}
          height={300}
        />
      </div>*/}

      {/* Input Sources with Barcode System */}
      <ProcessSection title="Fuentes de Biorresiduos" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProcessStep
            icon={School}
            title="Centros Educativos"
            description="Recolección mediante sistema de bolsas compostables con código de barras"
            onClick={() => handleStepClick('education')}
            isActive={activeStep === 'education'}
            className="border-t-4 border-blue-500"
          />
          <ProcessStep
            icon={Home}
            title="Domicilios"
            description="Sistema de recolección domiciliaria con seguimiento digital"
            onClick={() => handleStepClick('homes')}
            isActive={activeStep === 'homes'}
            className="border-t-4 border-green-500"
          />
          <ProcessStep
            icon={UtensilsCrossed}
            title="Bares y Restaurantes"
            description="Gestión especializada para el sector HORECA"
            onClick={() => handleStepClick('restaurants')}
            isActive={activeStep === 'restaurants'}
            className="border-t-4 border-orange-500"
          />
        </div>
      </ProcessSection>

      {/* Collection Process */}
      <ProcessSection title="Proceso de Recolección" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProcessStep
            icon={Truck}
            title="Recogida Separada"
            description="Sistema de recolección remunerada con rutas optimizadas"
            onClick={toggleProcessingDetails}
            isActive={showProcessingDetails}
          />
          <ProcessStep
            icon={Recycle}
            title="Gestión de Materiales"
            description="Clasificación y preparación para el procesamiento"
            onClick={toggleProcessingDetails}
            isActive={showProcessingDetails}
          />
        </div>
      </ProcessSection>

      {/* Processing Center */}
      <ProcessSection title="Centro de Procesamiento" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {processingSteps.map((step, index) => (
            <ProcessingStep
              key={index}
              title={step.title}
              description={step.description}
              isActive={showProcessingDetails}
            />
          ))}
        </div>
      </ProcessSection>

      {/* Output Channels */}
      <ProcessSection title="Comercialización" className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProcessStep
            icon={ShoppingBag}
            title="Venta Detallista"
            description="Distribución a comercios locales y tiendas especializadas"
            onClick={() => handleStepClick('retail')}
            isActive={activeStep === 'retail'}
            className="border-l-4 border-purple-500"
          />
          <ProcessStep
            icon={Trees}
            title="Usos Agrícolas"
            description="Suministro directo a agricultores y proyectos agrícolas"
            onClick={() => handleStepClick('agriculture')}
            isActive={activeStep === 'agriculture'}
            className="border-l-4 border-yellow-500"
          />
        </div>
      </ProcessSection>

      {/* Digital Integration */}
      <ProcessSection title="Sistema Digital Integrado">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProcessStep
            icon={Smartphone}
            title="App Móvil"
            description="Gestión de recolecciones y seguimiento en tiempo real"
            onClick={() => handleStepClick('mobile')}
            isActive={activeStep === 'mobile'}
          />
          <ProcessStep
            icon={Globe}
            title="Espacio Web"
            description="Portal informativo y sistema de gestión de pedidos"
            onClick={() => handleStepClick('web')}
            isActive={activeStep === 'web'}
          />
          <ProcessStep
            icon={Building2}
            title="Gestión Empresarial"
            description="Sistema integrado de administración y valoración económica"
            onClick={() => handleStepClick('management')}
            isActive={activeStep === 'management'}
          />
        </div>
      </ProcessSection>
    </div>
  );
};

export default ModeloNegocio;