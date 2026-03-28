"use client";

import {
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "framer-motion";
import { useEffect, useState } from "react";

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}

export function ZenParticles() {
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Generate static particles
    const newParticles = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      delay: Math.random() * 5,
      color: i % 4 === 0 ? "rgba(255, 114, 94, 0.4)" : "rgba(30, 30, 30, 0.2)", // Peach or Soft Black
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
      {particles.map((p) => (
        <Particle key={p.id} p={p} mouseX={mouseX} mouseY={mouseY} />
      ))}
    </div>
  );
}

function Particle({
  p,
  mouseX,
  mouseY,
}: {
  p: ParticleProps;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const springX = useSpring(useTransform(mouseX, [0, 1920], [-20, 20]), {
    stiffness: 50,
    damping: 20,
  });
  const springY = useSpring(useTransform(mouseY, [0, 1080], [-20, 20]), {
    stiffness: 50,
    damping: 20,
  });

  return (
    <motion.div
      style={{
        left: `${p.x}%`,
        top: `${p.y}%`,
        x: springX,
        y: springY,
        width: p.size,
        height: p.size,
        backgroundColor: p.color,
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
      }}
      animate={{
        opacity: [0.1, 0.4, 0.1],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + p.delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay: p.delay,
      }}
      className="absolute rounded-full"
    />
  );
}
