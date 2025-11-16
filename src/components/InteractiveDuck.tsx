import { useEffect, useState, useRef } from "react";
import duckImage from "@/assets/duck.webp";

const InteractiveDuck = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerCenter, setContainerCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCenter = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerCenter({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);
    window.addEventListener("scroll", updateCenter);

    return () => {
      window.removeEventListener("resize", updateCenter);
      window.removeEventListener("scroll", updateCenter);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate arrows in a circle around the duck
  const numArrows = 16;
  const arrows = Array.from({ length: numArrows }, (_, i) => {
    const baseAngle = (i / numArrows) * Math.PI * 2;
    const baseRadius = 80; // Distance from duck center to arrow start
    
    // Calculate arrow start position (around the duck)
    const startX = Math.cos(baseAngle) * baseRadius;
    const startY = Math.sin(baseAngle) * baseRadius;
    
    // Calculate direction to mouse from duck center
    const dx = mousePosition.x - containerCenter.x;
    const dy = mousePosition.y - containerCenter.y;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    const angleToMouse = Math.atan2(dy, dx);
    
    // Calculate arrow length based on distance to mouse (max 100px, min 20px)
    const maxLength = 100;
    const minLength = 20;
    const length = Math.max(minLength, Math.min(maxLength, distanceToMouse / 3));
    
    // Arrow points toward mouse
    const endX = startX + Math.cos(angleToMouse) * length;
    const endY = startY + Math.sin(angleToMouse) * length;
    
    return { startX, startY, endX, endY, length };
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 flex items-center justify-center overflow-hidden"
    >
      {/* SVG for arrows */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <g transform={`translate(${containerCenter.x - (containerRef.current?.getBoundingClientRect().left || 0)}, ${containerCenter.y - (containerRef.current?.getBoundingClientRect().top || 0)})`}>
          {arrows.map((arrow, i) => (
            <g key={i}>
              <line
                x1={arrow.startX}
                y1={arrow.startY}
                x2={arrow.endX}
                y2={arrow.endY}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                opacity={0.6}
                className="transition-all duration-100"
              />
              {/* Arrowhead */}
              <polygon
                points={`${arrow.endX},${arrow.endY} ${arrow.endX - 8},${arrow.endY - 4} ${arrow.endX - 8},${arrow.endY + 4}`}
                fill="hsl(var(--primary))"
                opacity={0.6}
                className="transition-all duration-100"
                transform={`rotate(${Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX) * (180 / Math.PI)}, ${arrow.endX}, ${arrow.endY})`}
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Fixed Duck in center */}
      <div
        className="absolute cursor-pointer"
        style={{ 
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
