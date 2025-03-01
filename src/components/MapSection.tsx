import Map from "@/components/Map";

const MapSection = () => {
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-extrabold mb-4 text-center text-[#2f4f27]">
          ¿Dónde estamos?
        </h1>
        <p className="text-lg text-center mb-10">
          Trabajamos en la Sierra Sur de Sevilla, especialmente en <span className="font-bold text-[#2f4f27]">OSUNA</span>
        </p>
        <Map />
      </div>
    </section>
  );
};

export default MapSection;