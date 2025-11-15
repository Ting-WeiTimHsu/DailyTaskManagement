import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

const BackgroundParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const colors = [
      "hsl(195 95% 65%)", // primary blue
      "hsl(280 85% 75%)", // purple
      "hsl(50 95% 65%)",  // yellow
      "hsl(195 85% 50%)", // darker blue
    ];

    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 150 + 50,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full blur-3xl"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${particle.color}, transparent)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Geometric shapes */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
          }}
          animate={{
            rotate: [0, 360],
            y: [0, -50, 0],
            x: [0, 25, -25, 0],
          }}
          transition={{
            duration: Math.random() * 25 + 20,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {i % 3 === 0 ? (
            <div 
              className="w-full h-full border-2 rounded-lg opacity-20"
              style={{ borderColor: "hsl(195 85% 50%)" }}
            />
          ) : i % 3 === 1 ? (
            <div 
              className="w-full h-full border-2 rounded-full opacity-20"
              style={{ borderColor: "hsl(280 85% 65%)" }}
            />
          ) : (
            <div 
              className="w-full h-full border-2 opacity-20"
              style={{ 
                borderColor: "hsl(50 95% 65%)",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)"
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
