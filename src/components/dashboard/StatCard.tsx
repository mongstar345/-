import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  trend?: number;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    shadow: 'shadow-blue-500/30',
    text: 'text-blue-600',
    ring: 'ring-blue-500/20',
  },
  green: {
    bg: 'from-green-500 to-green-600',
    shadow: 'shadow-green-500/30',
    text: 'text-green-600',
    ring: 'ring-green-500/20',
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    shadow: 'shadow-orange-500/30',
    text: 'text-orange-600',
    ring: 'ring-orange-500/20',
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    shadow: 'shadow-purple-500/30',
    text: 'text-purple-600',
    ring: 'ring-purple-500/20',
  },
  red: {
    bg: 'from-red-500 to-red-600',
    shadow: 'shadow-red-500/30',
    text: 'text-red-600',
    ring: 'ring-red-500/20',
  },
};

export function StatCard({ icon: Icon, label, value, color, trend }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-2xl p-4 shadow-lg ${colors.shadow} border border-gray-100 hover:border-${color}-200 transition-all cursor-pointer relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-full blur-2xl`} />
      </div>

      <div className="relative">
        {/* Icon */}
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.bg} flex items-center justify-center mb-3 shadow-lg ${colors.shadow}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </motion.div>

        {/* Label */}
        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>

        {/* Value */}
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>

          {/* Trend */}
          {trend !== undefined && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-1 text-xs font-semibold ${
                trend > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              <svg
                className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
              {Math.abs(trend)}%
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
