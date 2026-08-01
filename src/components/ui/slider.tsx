import * as React from 'react';

export interface SliderProps {
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
  className?: string;
}

export function Slider({ value, min, max, step, onValueChange, className = '' }: SliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange([Number(e.target.value)]);
  };

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
        }}
      />
    </div>
  );
}
