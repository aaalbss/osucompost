import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

export default function ViedoPlayerEnlace({ videoUrl, thumbnailUrl }) {
  return (
    <a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full"
    >
      <motion.div
        className="relative cursor-pointer group w-full max-w-3x1 mx-auto border-2 border-green-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
        whileHover={{ scale: 1.02 }}
      >
        <Image
          src={thumbnailUrl}
          alt="Video thumbnail"
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
        </div>
      </motion.div>
    </a>
  );
}
