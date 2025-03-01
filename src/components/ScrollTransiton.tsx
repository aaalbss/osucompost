import { useRef, ReactNode, useEffect, useState } from "react";
import { motion, useInView, useScroll } from "framer-motion";

type ScrollTransitionProps = {
  children: ReactNode;
  className?: string;
  threshold?: number;  // Umbral personalizable para determinar cuándo está en vista
  stability?: number;  // Tiempo de estabilidad en ms
};

const ScrollTransition: React.FC<ScrollTransitionProps> = ({ 
  children, 
  className,
  threshold = 0.3,
  stability = 200  // Tiempo de estabilidad predeterminado
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: threshold });
  const { scrollY } = useScroll();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  
  // Estado estable para controlar la visibilidad
  const [stableVisibility, setStableVisibility] = useState(false);
  // Referencia al temporizador para evitar múltiples timers
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollY.get();
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    const unsubscribe = scrollY.onChange(handleScroll);
    return () => unsubscribe();
  }, [lastScrollY, scrollY]);

  // Efecto para estabilizar la visibilidad
  useEffect(() => {
    // Si el componente entra en vista, configuramos un temporizador
    if (isInView) {
      // Limpiamos cualquier temporizador existente
      if (timerRef.current) clearTimeout(timerRef.current);
      
      // Configuramos un nuevo temporizador
      timerRef.current = setTimeout(() => {
        setStableVisibility(true);
      }, stability);
    } else {
      // Si ya no está en vista por un tiempo, limpiamos y restablecemos
      if (timerRef.current) clearTimeout(timerRef.current);
      
      timerRef.current = setTimeout(() => {
        setStableVisibility(false);
      }, stability * 2); // Tiempo más largo para ocultar para evitar parpadeos
    }
    
    // Limpieza
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isInView, stability]);

  // Determinar si el componente debe mostrarse
  // Una vez que alcanza stableVisibility=true, solo volverá a false cuando claramente esté fuera de vista
  const shouldShow = stableVisibility || (isInView && !isScrollingDown);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={
        shouldShow
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 50, scale: 0.95 }
      }
      transition={{ 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1], 
        damping: 15, 
        stiffness: 100 
      }}
      className={`transition-transform duration-700 ease-out ${className || ""}`}
    >
      {children}
    </motion.div>
  );
};

export default ScrollTransition;