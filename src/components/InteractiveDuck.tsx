import { useEffect, useState, useRef } from "react";
import duckImage from "@/assets/duck.webp";

const InteractiveDuck = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerBounds, setContainerBounds] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const updateBounds = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerBounds({
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);
    window.addEventListener("scroll", updateBounds);

    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
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

  // Generate arrows/dots in a grid pattern across the entire container
  const gridCols = 12;
  const gridRows = 8;
  const arrows = Array.from({ length: gridCols * gridRows }, (_, i) => {
    const col = i % gridCols;
    const row = Math.floor(i / gridCols);
    
    // Calculate grid position across the entire container
    const startX = (col / (gridCols - 1)) * containerBounds.width;
    const startY = (row / (gridRows - 1)) * containerBounds.height;
    
    if (!isMouseInside) {
      return { startX, startY, endX: startX, endY: startY, isDot: true };
    }
    
    // Calculate direction from arrow start to mouse position (relative to container)
    const mouseLocalX = mousePosition.x - containerBounds.left;
    const mouseLocalY = mousePosition.y - containerBounds.top;
    
    const dx = mouseLocalX - startX;
    const dy = mouseLocalY - startY;
    const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    const angleToMouse = Math.atan2(dy, dx);
    
    // Calculate arrow length based on distance to mouse
    const maxLength = 60;
    const minLength = 25;
    const length = Math.max(minLength, Math.min(maxLength, distanceToMouse * 0.3));
    
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
        {arrows.map((arrow, i) => (
          <g key={i}>
            {arrow.isDot ? (
              <circle
                cx={arrow.startX}
                cy={arrow.startY}
                r="4"
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
                  strokeWidth="2.5"
                  className="transition-all duration-200"
                />
                {/* Arrowhead */}
                <polygon
                  points={`${arrow.endX},${arrow.endY} ${arrow.endX - 8},${arrow.endY - 4} ${arrow.endX - 8},${arrow.endY + 4}`}
                  fill="black"
                  className="transition-all duration-200"
                  transform={`rotate(${Math.atan2(arrow.endY - arrow.startY, arrow.endX - arrow.startX) * (180 / Math.PI)}, ${arrow.endX}, ${arrow.endY})`}
                />
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Fixed Duck in Center */}
      <div
        className="absolute"
        style={{ 
          width: "180px", 
          height: "180px",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
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
