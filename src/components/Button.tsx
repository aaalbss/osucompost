import { Button } from '@headlessui/react';
import { ReactNode } from 'react';

interface CustomButtonProps {
  children: ReactNode;
  onClick?: () => void;
}

export default function CustomButton({ children, onClick }: CustomButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 px-3 text-sm
       font-medium text-green-800 shadow-inner shadow-white/10 focus:outline-none hover:bg-green-600 focus:outline focus:outline-1 focus:outline-white"
    >
      {children}
    </Button>
  );
}
