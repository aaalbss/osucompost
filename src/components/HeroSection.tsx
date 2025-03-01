const HeroSection = () => {
  return (
    <section className="relative text-center py-20">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 h-[100%] bg-cover bg-center bg-no-repeat filter blur-sm opacity-75"
        style={{
          backgroundImage: "url(/images/hero_section.jpg)", // Reemplaza con la ruta de tu imagen
        }}
      ></div>

      {/* Contenido del Hero */}
      <div
        className="relative container mx-auto text-white"
        style={{ perspective: "1000px" }} // Añadir perspectiva 3D
      >
        <h2 className="text-6xl font-extrabold mb-4 transition-transform duration-300 ease-in-out hero-title">
          OSUCOMPOST
        </h2>
        <p className="text-lg mb-8">
          Recogida separada remunerada de bioresiduos y vermicompostaje.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
