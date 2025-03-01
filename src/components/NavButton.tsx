"use client";

import Link from "next/link";

interface NavButtonProps {
  href: string;
  text: string;
}

const NavButton: React.FC<NavButtonProps> = ({ href, text }) => {
  return (
    <li>
      <button
        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-sans text-sm font-medium text-green-800 hover:text-green-900"
      >
        <div
          className="relative flex items-center justify-center py-2 px-4 rounded-full bg-white transform transition duration-200 group-hover:bg-green-200 shadow-md"
        >
          <Link href={href} className="select-none">
            {text}
          </Link>
        </div>
      </button>
    </li>
  );
};

export default NavButton;
