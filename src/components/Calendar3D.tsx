"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Calendar3D() {
  const calendarRef = useRef(null);

  useEffect(() => {
    const calendar = calendarRef.current;

    gsap.to(calendar, {
      rotateY: 360,
      duration: 2,
      ease: "power2.inOut",
      scrollTrigger: {
        trigger: calendar,
        start: "top 80%",
        end: "bottom 20%",
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div
        ref={calendarRef}
        className="w-64 h-80 bg-white shadow-2xl rounded-lg flex items-center justify-center text-black text-2xl font-bold transform perspective-1000"
      >
        📅 Calendario 2025
      </div>
    </div>
  );
}
