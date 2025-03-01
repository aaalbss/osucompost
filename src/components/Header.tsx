import NavButton from "@/components/NavButton";
import Title from "@/components/Title";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Title text="OSUCOMPOST" />
        <nav>
          <ul className="flex space-x-4">
            <NavButton href="#about" text="Sobre Nosotros" />
            <NavButton href="#reward" text="Sistema de Recogida" />
            <NavButton href="#products" text="Productos" />
            <NavButton href="#contact" text="Contacto" />
            <NavButton href="/recursos-educativos" text="Recursos educativos" />
            <NavButton href="/area-cliente" text="Área Cliente" />
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
