import { useEffect, useRef, useState } from "react";

const InteractiveDuck = () => {
  const duckRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [duckRotation, setDuckRotation] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (duckRef.current) {
        const duckRect = duckRef.current.getBoundingClientRect();
        const duckCenterX = duckRect.left + duckRect.width / 2;
        const duckCenterY = duckRect.top + duckRect.height / 2;
        
        const angle = Math.atan2(e.clientY - duckCenterY, e.clientX - duckCenterX);
        const rotation = (angle * 180) / Math.PI;
        
        setMousePosition({ x: e.clientX, y: e.clientY });
        setDuckRotation(rotation);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-48 flex items-center justify-center overflow-hidden">
      {/* Gradient vectors that follow the mouse */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ filter: "blur(40px)" }}
      >
        <defs>
          <radialGradient id="gradientGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(280 85% 65%)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="hsl(195 95% 65%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(50 95% 65%)" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <circle
          cx={mousePosition.x}
          cy={mousePosition.y - window.scrollY}
          r="150"
          fill="url(#gradientGlow)"
          className="transition-all duration-300"
        />
      </svg>

      {/* Interactive duck */}
      <div
        ref={duckRef}
        className="relative z-10 transition-transform duration-200"
        style={{
          transform: `rotate(${duckRotation}deg)`,
        }}
      >
        <div className="text-8xl cursor-pointer hover:scale-110 transition-transform duration-300 drop-shadow-2xl">
          🦆
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
