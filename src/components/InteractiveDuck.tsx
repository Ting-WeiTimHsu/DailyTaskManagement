import { useEffect, useState, useRef } from "react";
import duckImage from "@/assets/duck.webp";

const InteractiveDuck = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
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
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const isInside = 
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        
        setIsMouseInside(isInside);
        if (isInside) {
          setMousePosition({ x: e.clientX, y: e.clientY });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate duck position (orbits around center based on mouse)
  const duckPosition = (() => {
    if (!isMouseInside) return { x: 0, y: 0 };
    
    const dx = mousePosition.x - containerCenter.x;
    const dy = mousePosition.y - containerCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 1) return { x: 0, y: 0 };
    
    const angle = Math.atan2(dy, dx);
    const orbitRadius = 60; // How far the duck orbits from center
    
    return {
      x: Math.cos(angle) * orbitRadius,
      y: Math.sin(angle) * orbitRadius,
    };
  })();

  // Generate arrows/dots in a dense circle
  const numArrows = 48; // More arrows for denser effect
  const arrows = Array.from({ length: numArrows }, (_, i) => {
    const baseAngle = (i / numArrows) * Math.PI * 2;
    const baseRadius = 100; // Distance from container center to arrow start
    
    // Calculate arrow start position (around the center)
    const startX = Math.cos(baseAngle) * baseRadius;
    const startY = Math.sin(baseAngle) * baseRadius;
    
    if (!isMouseInside) {
      return { startX, startY, endX: startX, endY: startY, isDot: true };
    }
    
    // Calculate direction from arrow start to mouse position
    const mouseLocalX = mousePosition.x - containerCenter.x;
    const mouseLocalY = mousePosition.y - containerCenter.y;
    
    const dx = mouseLocalX - startX;
    const dy = mouseLocalY - startY;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    const angleToMouse = Math.atan2(dy, dx);
    
    // Calculate arrow length based on distance to mouse
    const maxLength = 80;
    const minLength = 30;
    const length = Math.max(minLength, Math.min(maxLength, distanceToMouse * 0.4));
    
    // Arrow points toward mouse
    const endX = startX + Math.cos(angleToMouse) * length;
    const endY = startY + Math.sin(angleToMouse) * length;
    
    return { startX, startY, endX, endY, isDot: false };
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-64 flex items-center justify-center overflow-hidden"
    >
      {/* SVG for arrows/dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <g transform={`translate(${containerCenter.x - (containerRef.current?.getBoundingClientRect().left || 0)}, ${containerCenter.y - (containerRef.current?.getBoundingClientRect().top || 0)})`}>
          {arrows.map((arrow, i) => (
            <g key={i}>
              {arrow.isDot ? (
                <circle
                  cx={arrow.startX}
                  cy={arrow.startY}
                  r="3"
                  fill="black"
                  className="transition-all duration-300"
                />
              ) : (
                <>
                  <line
                    x1={arrow.startX}
                    y1={arrow.startY}
                    x2={arrow.endX}
                    y2={arrow.endY}
                    stroke="black"
                    strokeWidth="3"
                    className="transition-all duration-200"
                  />
                  {/* Arrowhead */}
                  <polygon
                    points={`${arrow.endX},${arrow.endY} ${arrow.endX - 10},${arrow.endY - 5} ${arrow.endX - 10},${arrow.endY + 5}`}
                    fill="black"
                    className="transition-all duration-200"
                    transform={`rotate(${Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX) * (180 / Math.PI)}, ${arrow.endX}, ${arrow.endY})`}
                  />
                </>
              )}
            </g>
          ))}
        </g>
      </svg>

      {/* Orbiting Duck */}
      <div
        className="absolute transition-all duration-300 ease-out"
        style={{ 
          width: "160px", 
          height: "160px",
          transform: `translate(${duckPosition.x}px, ${duckPosition.y}px)`,
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
