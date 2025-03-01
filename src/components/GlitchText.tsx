import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type GlitchTextProps = {
  text: string;
};

const GlitchText: React.FC<GlitchTextProps> = ({ text }) => {
  const [glitch, setGlitch] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(
        text
          .split("")
          .map((char) => (Math.random() > 0.9 ? "#" : char))
          .join("")
      );
    }, 200);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <div className="relative text-4xl font-bold text-white">
      <motion.span
        className="absolute left-0 top-0 text-red-500"
        animate={{ x: [-1, 1, -1], y: [1, -1, 1] }}
        transition={{ repeat: Infinity, duration: 0.1 }}
      >
        {glitch}
      </motion.span>
      <motion.span
        className="absolute left-0 top-0 text-blue-500"
        animate={{ x: [1, -1, 1], y: [-1, 1, -1] }}
        transition={{ repeat: Infinity, duration: 0.1 }}
      >
        {glitch}
      </motion.span>
      <span className="relative text-white">{glitch}</span>
    </div>
  );
};

export default GlitchText;
