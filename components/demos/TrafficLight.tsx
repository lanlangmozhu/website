
import React, { useState, useEffect } from 'react';

type LightState = 'red' | 'yellow' | 'green';

const TrafficLight: React.FC = () => {
  const [light, setLight] = useState<LightState>('red');
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    if (!isAuto) return;

    const timer = setInterval(() => {
      setLight(current => {
        if (current === 'red') return 'green';
        if (current === 'green') return 'yellow';
        return 'red';
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAuto]);

  const getOpacity = (color: LightState) => light === color ? 1 : 0.2;
  const getGlow = (color: LightState) => light === color ? `0 0 20px ${color}` : 'none';

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-100 dark:bg-gray-900 rounded-xl">
      <div className="bg-gray-800 p-4 rounded-full flex flex-col gap-3 shadow-2xl border border-gray-700">
        <div 
          className="w-12 h-12 rounded-full bg-red-500 transition-all duration-300"
          style={{ opacity: getOpacity('red'), boxShadow: getGlow('red') }}
        />
        <div 
          className="w-12 h-12 rounded-full bg-yellow-400 transition-all duration-300"
          style={{ opacity: getOpacity('yellow'), boxShadow: getGlow('yellow') }}
        />
        <div 
          className="w-12 h-12 rounded-full bg-green-500 transition-all duration-300"
          style={{ opacity: getOpacity('green'), boxShadow: getGlow('green') }}
        />
      </div>

      <div className="flex gap-2 mt-2">
        <button 
          onClick={() => setIsAuto(!isAuto)}
          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            isAuto ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
          }`}
        >
          {isAuto ? '自动模式 (开)' : '手动模式'}
        </button>
      </div>

      {!isAuto && (
        <div className="flex gap-2">
          <button onClick={() => setLight('red')} className="w-3 h-3 rounded-full bg-red-500" />
          <button onClick={() => setLight('yellow')} className="w-3 h-3 rounded-full bg-yellow-500" />
          <button onClick={() => setLight('green')} className="w-3 h-3 rounded-full bg-green-500" />
        </div>
      )}
    </div>
  );
};

export default TrafficLight;
