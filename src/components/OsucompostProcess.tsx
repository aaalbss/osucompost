import React from 'react';
import { Recycle, Home, UtensilsCrossed, Factory, Leaf, Package, Worm, BarChart2, Droplets, ThermometerSun, ArrowDown, ArrowUp, Info } from 'lucide-react';
import ProcesoReciclado from './ProcesoReciclado';
import { TfiTrash } from "react-icons/tfi";
import { CiBoxes } from "react-icons/ci";

interface ProcessStepProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}

interface ProcessInfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

interface DetailTabProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const ProcessStep: React.FC<ProcessStepProps> = ({ icon: Icon, title, description }) => (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-200/20 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
      <div className="p-3 rounded-full">
        <Icon className="w-6 h-6 text-green-800" />
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-2 text-green-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );

const ProcessInfoCard: React.FC<ProcessInfoCardProps> = ({ title, children, className = "" }) => (
  <div className={`bg-white/70 backdrop-blur-sm rounded-lg shadow-sm p-6 ${className}`}>
    <h3 className="text-xl font-semibold text-green-800 mb-4">{title}</h3>
    {children}
  </div>
);

const DetailTab: React.FC<DetailTabProps> = ({ icon: Icon, title, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-6 py-3 border-2 rounded-lg transition-all ${isActive ? "border-green-800 text-green-800 bg-white" : "border-transparent text-gray-600 hover:border-green-600 hover:text-green-800"}`}
  >
    <Icon className="w-5 h-5" />
    <span>{title}</span>
  </button>
);

const OsucompostProcess = () => {
  const [activeTab, setActiveTab] = React.useState("collection");
  const [showMoreInfo, setShowMoreInfo] = React.useState(false);
  const [activeDetailTab, setActiveDetailTab] = React.useState("process");

  const detailTabs = [
    { id: "process", title: "Proceso", icon: Recycle },
    { id: "characteristics", title: "Características", icon: Info },
    { id: "technical", title: "Detalles Técnicos", icon: Factory }
  ];

  const renderDetailContent = () => {
    switch (activeDetailTab) {
      case "process":
        return (
          <ProcessInfoCard title="Proceso de Reciclado">
            <ProcesoReciclado />
          </ProcessInfoCard>
        );
      case "characteristics":
        return (
          <ProcessInfoCard title="Características del Proceso">
            <ul className="space-y-4">
              <li className="flex items-start p-3 bg-green-50 rounded-lg">
                <Worm className="w-5 h-5 mr-3 mt-1 text-green-600" />
                <span>Proceso mesófilo (10-32°C) que combina acción de lombrices y microorganismos beneficiosos</span>
              </li>
              <li className="flex items-start p-3 bg-green-50 rounded-lg">
                <Recycle className="w-5 h-5 mr-3 mt-1 text-green-600" />
                <span>Mayor velocidad de procesamiento comparado con el compostaje tradicional</span>
              </li>
              <li className="flex items-start p-3 bg-green-50 rounded-lg">
                <ThermometerSun className="w-5 h-5 mr-3 mt-1 text-green-600" />
                <span>Control preciso de temperatura y humedad para optimizar el proceso</span>
              </li>
            </ul>
          </ProcessInfoCard>
        );
      case "technical":
        return (
          <ProcessInfoCard title="Detalles Técnicos del Proceso" className="bg-green-50">
            <div className="space-y-4">
              <p className="text-gray-600">
                El proceso de vermicompostaje utiliza lombrices rojas californianas (Eisenia foetida) para descomponer los residuos orgánicos. Es altamente eficiente y produce un abono de excelente calidad.
              </p>
              <p className="text-gray-600">
                Se controlan constantemente parámetros como la temperatura, humedad y pH para asegurar condiciones óptimas para las lombrices y los microorganismos.
              </p>
            </div>
          </ProcessInfoCard>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 ">
      <div className="mb-8">
        <header>
          <h1 className="text-3xl text-center font-bold text-green-800">
            Sistema de Gestión de Biorresiduos
          </h1>
          <p className="text-center text-gray-600 mt-2">
            Transformamos los residuos orgánicos en recursos valiosos para la agricultura sostenible
          </p>
        </header>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => setActiveTab("collection")}
            className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${activeTab === "collection" ? "border-green-800 text-green-800" : "border-transparent text-gray-600 hover:border-green-600 hover:text-green-800"}`}
          >
            <TfiTrash className={`w-6 h-6 ${activeTab === "collection" ? "text-green-600" : "text-gray-600"}`} />
            <span className="ml-2">Recolección</span>
          </button>
          <button
            onClick={() => setActiveTab("processing")}
            className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${activeTab === "processing" ? "border-green-800 text-green-800" : "border-transparent text-gray-600 hover:border-green-600 hover:text-green-800"}`}
          >
            <Recycle className={`w-6 h-6 ${activeTab === "processing" ? "text-green-600" : "text-gray-600"}`} />
            <span className="ml-2">Procesamiento</span>
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${activeTab === "products" ? "border-green-800 text-green-800" : "border-transparent text-gray-600 hover:border-green-600 hover:text-green-800"}`}
          >
            <CiBoxes className={`w-6 h-6 ${activeTab === "products" ? "text-green-600" : "text-gray-600"}`} />
            <span className="ml-2">Productos</span>
          </button>
          <button
            onClick={() => setActiveTab("benefits")}
            className={`flex items-center justify-center p-4 border-2 rounded-lg transition-all ${activeTab === "benefits" ? "border-green-800 text-green-800" : "border-transparent text-gray-600 hover:border-green-600 hover:text-green-800"}`}
          >
            <BarChart2 className={`w-6 h-6 ${activeTab === "benefits" ? "text-green-600" : "text-gray-600"}`} />
            <span className="ml-2">Beneficios</span>
          </button>
        </div>

        {activeTab === "collection" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Sistema de Recolección</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <ProcessStep
                icon={Home}
                title="Domicilios"
                description="Servicio de recogida puerta a puerta con contenedores adaptados a las necesidades de cada hogar."
              />
              <ProcessStep
                icon={UtensilsCrossed}
                title="Comercios"
                description="Soluciones personalizadas para supermercados, fruterías, comedores y establecimientos hosteleros."
              />
              <ProcessStep
                icon={Leaf}
                title="Material Estructurante"
                description="Aprovechamiento de restos de poda y residuos agrícolas para optimizar el proceso de compostaje."
              />
            </div>
          </div>
        )}

        {activeTab === "processing" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Proceso de Vermicompostaje</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <ProcessStep
                icon={Factory}
                title="Tecnología Verde"
                description="Proceso biológico que combina la acción de lombrices rojas californianas (Eisenia foetida) y microorganismos para transformar residuos orgánicos en abono de alta calidad."
              />
              <ProcessStep
                icon={ThermometerSun}
                title="Control de Proceso"
                description="Sistema de monitorización constante de temperatura, humedad y otros parámetros clave para garantizar condiciones óptimas de producción."
              />
              <ProcessStep
                icon={Droplets}
                title="Gestión de Lixiviados"
                description="Recuperación y tratamiento de lixiviados para la producción de humus líquido, aprovechando todos los nutrientes del proceso."
              />
            </div>

            {/*<div className="flex justify-center mt-8">
              <button
                onClick={() => setShowMoreInfo(!showMoreInfo)}
                className="group flex items-center space-x-2 px-6 py-3 border-2 border-green-800 text-green-800 rounded-lg hover:bg-green-50 transition-all"
              >
                <span>{showMoreInfo ? "Menos información" : "Más información"}</span>
                {showMoreInfo ? (
                  <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                ) : (
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                )}
              </button>
            </div>

            {showMoreInfo && (
              <div className="mt-8 space-y-6">
                <div className="flex justify-center space-x-4 overflow-x-auto pb-2">
                  {detailTabs.map(tab => (
                    <DetailTab
                      key={tab.id}
                      icon={tab.icon}
                      title={tab.title}
                      isActive={activeDetailTab === tab.id}
                      onClick={() => setActiveDetailTab(tab.id)}
                    />
                  ))}
                </div>
                <div className="mt-6">
                  {renderDetailContent()}
                </div>
              </div>
            )}*/}
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Productos</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <ProcessStep
                icon={Package}
                title="Humus de Lombriz"
                description="Fertilizante orgánico de alta calidad en formato sólido y líquido, certificado para agricultura ecológica."
              />
              <ProcessStep
                icon={Worm}
                title="Lombrices Vivas"
                description="Suministro de lombrices para vermicultores, granjas avícolas ecológicas y sector pesquero."
              />
            </div>
          </div>
        )}

        {activeTab === "benefits" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Beneficios del Sistema</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <ProcessStep
                icon={Recycle}
                title="Economía Circular"
                description="Sistema pionero que recompensa la correcta separación de residuos orgánicos, fomentando la economía circular."
              />
              <ProcessStep
                icon={Leaf}
                title="Impacto Ambiental"
                description="Reducción de emisiones de CO2 y mejora de la calidad del suelo mediante fertilizantes naturales."
              />
             <ProcessStep
                icon={BarChart2}
                title="Valor Social"
                description="Creación de empleo local y concienciación ambiental en la comunidad."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OsucompostProcess;
