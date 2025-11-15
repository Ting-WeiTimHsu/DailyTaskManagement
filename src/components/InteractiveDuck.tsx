import { useEffect, useRef, useState } from "react";
import duckImage from "@/assets/duck.webp";

const InteractiveDuck = () => {
  const duckRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [duckPosition, setDuckPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      if (duckRef.current) {
        const duckRect = duckRef.current.getBoundingClientRect();
        const duckCenterX = duckRect.left + duckRect.width / 2;
        const duckCenterY = duckRect.top + duckRect.height / 2;
        setDuckPosition({ x: duckCenterX, y: duckCenterY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Create vectors pointing from duck to mouse
  const numVectors = 8;
  const vectors = Array.from({ length: numVectors }, (_, i) => {
    const angle = (i / numVectors) * Math.PI * 2;
    const baseLength = 60;
    
    // Calculate direction towards mouse
    const dx = mousePosition.x - duckPosition.x;
    const dy = mousePosition.y - duckPosition.y - window.scrollY;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    const influence = Math.max(0, Math.min(1, 300 / Math.max(distanceToMouse, 1)));
    
    // Vector direction
    const vectorDx = Math.cos(angle);
    const vectorDy = Math.sin(angle);
    
    // Angle to mouse from this vector
    const angleToMouse = Math.atan2(dy, dx);
    const vectorAngle = Math.atan2(vectorDy, vectorDx);
    const angleDiff = Math.abs(((angleToMouse - vectorAngle + Math.PI) % (Math.PI * 2)) - Math.PI);
    
    // Extend vectors that point toward mouse
    const extension = influence * (1 - angleDiff / Math.PI) * 40;
    const length = baseLength + extension;
    
    return {
      x1: Math.cos(angle) * 40,
      y1: Math.sin(angle) * 40,
      x2: Math.cos(angle) * length,
      y2: Math.sin(angle) * length,
      opacity: 0.4 + influence * 0.4,
    };
  });

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Interactive duck with vectors */}
      <div className="relative z-10 flex items-center justify-center">
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: "200px", height: "200px", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
        >
          <defs>
            <linearGradient id="vectorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(280 85% 65%)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(195 95% 65%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(50 95% 65%)" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <g transform="translate(100, 100)">
            {vectors.map((vector, i) => (
              <line
                key={i}
                x1={vector.x1}
                y1={vector.y1}
                x2={vector.x2}
                y2={vector.y2}
                stroke="url(#vectorGradient)"
                strokeWidth="3"
                strokeOpacity={vector.opacity}
                className="transition-all duration-200"
              />
            ))}
          </g>
        </svg>

        <div
          ref={duckRef}
          className="relative cursor-pointer hover:scale-110 transition-transform duration-300"
          style={{ width: "120px", height: "120px" }}
        >
          <img 
            src={duckImage} 
            alt="Interactive Duck" 
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Animated gradient rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-32 h-32 rounded-full border-4 border-accent/30 animate-ping" style={{ animationDuration: "3s" }} />
        <div className="absolute w-48 h-48 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDuration: "4s", animationDelay: "0.5s" }} />
      </div>
    </div>
  );
};

export default InteractiveDuck;
