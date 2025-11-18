import { useEffect, useState } from "react";

const FlipClock = () => {
  const [time, setTime] = useState(new Date());
  const [flipping, setFlipping] = useState({ hours: false, minutes: false });

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = new Date();
      const oldTime = time;
      
      // Trigger flip animation when values change
      if (newTime.getHours() !== oldTime.getHours()) {
        setFlipping(prev => ({ ...prev, hours: true }));
        setTimeout(() => setFlipping(prev => ({ ...prev, hours: false })), 600);
      }
      if (newTime.getMinutes() !== oldTime.getMinutes()) {
        setFlipping(prev => ({ ...prev, minutes: true }));
        setTimeout(() => setFlipping(prev => ({ ...prev, minutes: false })), 600);
      }
      
      setTime(newTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');
  const hours = time.getHours();
  const displayHours = hours % 12 || 12;
  const minutes = time.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';

  return (
    <div className="relative w-full h-32 sm:h-48 md:h-56 lg:h-64 flex items-center justify-center overflow-hidden">
      <style>{`
        @keyframes flip {
          0% {
            transform: rotateX(0deg);
          }
          50% {
            transform: rotateX(-90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
        
        .flip-card {
          animation: flip 0.6s ease-in-out;
        }
      `}</style>

      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 scale-75 sm:scale-90 md:scale-95 lg:scale-100">
        {/* Period (AM/PM) */}
        <div className="flex flex-col items-center">
          <div className="bg-foreground text-background text-xs sm:text-sm font-bold px-2 sm:px-3 py-1.5 sm:py-2 rounded shadow-lg">
            {period}
          </div>
        </div>

        {/* Hours */}
        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
          {formatNumber(displayHours).split('').map((digit, index) => (
            <div
              key={`hour-${index}`}
              className={`relative bg-foreground text-background text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-6 md:py-7 lg:py-8 rounded-lg shadow-2xl ${
                flipping.hours ? 'flip-card' : ''
              }`}
              style={{
                perspective: '1000px',
                minWidth: '50px',
                textAlign: 'center',
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-background/20"></div>
              {digit}
            </div>
          ))}
        </div>

        {/* Colon */}
        <div className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground pb-1 sm:pb-2">:</div>

        {/* Minutes */}
        <div className="flex gap-1 sm:gap-1.5 md:gap-2">
          {formatNumber(minutes).split('').map((digit, index) => (
            <div
              key={`minute-${index}`}
              className={`relative bg-foreground text-background text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold px-3 sm:px-4 md:px-5 lg:px-6 py-4 sm:py-6 md:py-7 lg:py-8 rounded-lg shadow-2xl ${
                flipping.minutes ? 'flip-card' : ''
              }`}
              style={{
                perspective: '1000px',
                minWidth: '50px',
                textAlign: 'center',
              }}
            >
              <div className="absolute inset-x-0 top-1/2 h-px bg-background/20"></div>
              {digit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlipClock;
