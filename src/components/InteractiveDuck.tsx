import { useEffect, useState } from "react";
import duckImage from "@/assets/duck.webp";

const InteractiveDuck = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [duckPosition, setDuckPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Update duck position to orbit around center based on mouse position
  useEffect(() => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Calculate angle from center to mouse
    const dx = mousePosition.x - centerX;
    const dy = mousePosition.y - centerY;
    const angle = Math.atan2(dy, dx);
    
    // Set orbit radius
    const orbitRadius = 150;
    
    // Calculate duck position on orbit
    const duckX = centerX + Math.cos(angle) * orbitRadius;
    const duckY = centerY + Math.sin(angle) * orbitRadius;
    
    setDuckPosition({ x: duckX, y: duckY });
  }, [mousePosition]);

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      <div
        className="absolute cursor-pointer transition-all duration-300 ease-out"
        style={{ 
          left: `${duckPosition.x}px`,
          top: `${duckPosition.y}px`,
          transform: "translate(-50%, -50%)",
          width: "120px", 
          height: "120px"
        }}
      >
        <img 
          src={duckImage} 
          alt="Interactive Duck" 
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
};

export default InteractiveDuck;
