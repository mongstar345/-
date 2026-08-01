import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ProgressRingProps {
  value: number; // 0-100
  label: string;
  color: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  icon: LucideIcon;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  animated?: boolean;
}

const colorConfig = {
  blue: {
    primary: '#3b82f6',
    secondary: '#dbeafe',
    gradient: ['#3b82f6', '#2563eb'],
  },
  purple: {
    primary: '#a855f7',
    secondary: '#f3e8ff',
    gradient: ['#a855f7', '#9333ea'],
  },
  green: {
    primary: '#22c55e',
    secondary: '#dcfce7',
    gradient: ['#22c55e', '#16a34a'],
  },
  orange: {
    primary: '#f59e0b',
    secondary: '#fef3c7',
    gradient: ['#f59e0b', '#d97706'],
  },
  red: {
    primary: '#ef4444',
    secondary: '#fee2e2',
    gradient: ['#ef4444', '#dc2626'],
  },
};

export function ProgressRing({
  value,
  label,
  color,
  icon: Icon,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  animated = true,
}: ProgressRingProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const colors = colorConfig[color];

  // Calculate circle properties
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayValue / 100) * circumference;

  // Smooth animation using requestAnimationFrame
  useEffect(() => {
    if (!animated) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startValue = displayValue;
    const endValue = value;
    const change = endValue - startValue;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutCubic)
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOutCubic(progress);

      const newValue = startValue + change * easedProgress;
      setDisplayValue(newValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        startTimeRef.current = undefined;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, animated]);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-2 cursor-pointer"
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* SVG Circle */}
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Define gradient */}
          <defs>
            <linearGradient
              id={`gradient-${color}-${label}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={colors.gradient[0]} />
              <stop offset="100%" stopColor={colors.gradient[1]} />
            </linearGradient>

            {/* Glow filter */}
            <filter id={`glow-${color}-${label}`}>
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#gradient-${color}-${label})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{
              duration: 1.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            style={{
              filter: `url(#glow-${color}-${label})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className="mb-1"
          >
            <Icon className="h-6 w-6" style={{ color: colors.primary }} />
          </motion.div>

          {/* Percentage */}
          {showPercentage && (
            <motion.div
              key={Math.floor(displayValue)}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              {Math.round(displayValue)}%
            </motion.div>
          )}
        </div>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}

// Lightweight version without animations for better performance in lists
export function ProgressRingLight({
  value,
  color,
  size = 40,
  strokeWidth = 4,
}: Pick<ProgressRingProps, 'value' | 'color' | 'size' | 'strokeWidth'>) {
  const colors = colorConfig[color];
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.secondary}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colors.primary}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}
