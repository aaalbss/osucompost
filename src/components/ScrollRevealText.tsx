import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ReactNode } from "react";

const sections = [
  "Bienvenido a nuestra experiencia interactiva.",
  "Desliza hacia abajo para descubrir más.",
  "Cada sección se revela con una animación.",
  "Esto crea un efecto envolvente y dinámico.",
  "Gracias por explorar este efecto de scroll animado."
];

export default function ScrollRevealText() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white text-6xl font-extrabold leading-tight">
      {sections.map((text, index) => (
        <RevealText key={index}>{text}</RevealText>
      ))}
    </div>
  );
}

function RevealText({ children }: { children: ReactNode }) {
  const { ref, inView } = useInView({ triggerOnce: false, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 100 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1.1 } : { opacity: 0, y: 100 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="my-32 text-center"
    >
      {children}
    </motion.div>
  );
}