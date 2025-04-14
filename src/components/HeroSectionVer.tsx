const HeroSection = () => {
	return (
	  <section className="relative py-20">
		{/* Imagen de fondo para móvil */}
		<div
		className="absolute inset-0 h-[100%] bg-cover bg-center bg-no-repeat filter blur-sm opacity-75 sm:hidden" // Solo visible en móvil
		style={{
			backgroundImage: "url(/images/hero_sectionVer_tablet.png)",
		}}
		></div>

		{/* Imagen de fondo para tablet */}
		<div
		className="absolute inset-0 h-[100%] bg-cover bg-center bg-no-repeat filter blur-sm opacity-75 hidden sm:block md:hidden" // Solo visible en tablet
		style={{
			backgroundImage: "url(/images/hero_sectionVer_tablet.png)",
		}}
		></div>

		{/* Imagen de fondo */}
		<div
		  className="absolute inset-0 h-[100%] bg-cover bg-center bg-no-repeat filter blur-sm opacity-75 hidden md:block" //Ultimos dos atributos para cambiar en movil y en tablet de imagen
		  style={{
			backgroundImage: "url(/images/hero_sectionVer.png)", // Reemplaza con la ruta de tu imagen
		  }}
		></div>
  
		{/* Contenido del Hero */}
		<div
		  className="text-white text-left pl-8 " // 
		  style={{ perspective: "1000px" }} // Añadir perspectiva 3D
		>
		  <h2 className="text-4xl font-extrabold mb-4 transition-transform duration-300 ease-in-out hero-title md:text-6xl">
			VerMicompostaje
		  </h2>
		  <p className="text-1xl mb-8 md:text-lg">
			Control de los parámetros de humedad y temperatura de nuestras composteras
		  </p>
		</div>
	  </section>
	);
  };
  
  export default HeroSection;
  