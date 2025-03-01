// components/Title.tsx
import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  return (
    <h1 className="text-xl font-bold text-green-800 transform transition-all duration-500 ease-in-out hover:translate-x-2 hover:brightness-110">
      {text}
    </h1>
  );
};

export default Title;
