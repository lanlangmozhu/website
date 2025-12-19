
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { RefreshCw } from 'lucide-react';

interface GsapBoxProps {
  color?: string;
  label?: string;
}

const GsapBox: React.FC<GsapBoxProps> = ({ color = '#3b82f6', label = 'Click Me' }) => {
  const boxRef = useRef<HTMLDivElement>(null);

  const animate = () => {
    if (!boxRef.current) return;
    
    // Reset
    gsap.set(boxRef.current, { rotation: 0, scale: 1 });

    // Animate
    gsap.to(boxRef.current, {
      rotation: 360,
      scale: 1.2,
      duration: 1,
      ease: "elastic.out(1, 0.3)",
      yoyo: true,
      repeat: 1
    });
  };

  useEffect(() => {
    // Initial intro animation
    gsap.from(boxRef.current, { opacity: 0, y: 50, duration: 1 });
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white/50 dark:bg-black/20 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <div 
        ref={boxRef}
        onClick={animate}
        className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center cursor-pointer select-none text-white font-bold text-center p-2 transition-shadow hover:shadow-xl"
        style={{ backgroundColor: color }}
      >
        {label}
      </div>
      <button 
        onClick={animate}
        className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
      >
        <RefreshCw size={14} /> 重放动画
      </button>
    </div>
  );
};

export default GsapBox;
