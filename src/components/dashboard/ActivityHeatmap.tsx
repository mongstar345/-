import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Tooltip } from '../ui/tooltip';
import { format, subDays, startOfWeek, addDays } from 'date-fns';

interface ActivityData {
  date: string;
  count: number;
}

interface ActivityHeatmapProps {
  data?: ActivityData[];
  weeks?: number;
}

export function ActivityHeatmap({ data = [], weeks = 12 }: ActivityHeatmapProps) {
  // Generate last N weeks of dates
  const heatmapData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, weeks * 7);
    const weekStart = startOfWeek(startDate);

    const grid: ActivityData[][] = [];
    let currentWeek: ActivityData[] = [];

    for (let i = 0; i < weeks * 7; i++) {
      const date = addDays(weekStart, i);
      const dateStr = format(date, 'yyyy-MM-dd');

      // Find activity for this date
      const activity = data.find((d) => d.date === dateStr);
      const count = activity?.count || 0;

      currentWeek.push({ date: dateStr, count });

      if ((i + 1) % 7 === 0) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }

    return grid;
  }, [data, weeks]);

  // Get color intensity based on count
  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (count <= 2) return 'bg-green-200 dark:bg-green-900';
    if (count <= 4) return 'bg-green-400 dark:bg-green-700';
    if (count <= 6) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-700 dark:bg-green-400';
  };

  // Get max count for legend
  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.count), 0),
    [data]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Overview
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Last {weeks} weeks of task activity
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded ${
                  level === 0
                    ? 'bg-gray-100 dark:bg-gray-800'
                    : level === 1
                    ? 'bg-green-200 dark:bg-green-900'
                    : level === 2
                    ? 'bg-green-400 dark:bg-green-700'
                    : level === 3
                    ? 'bg-green-600 dark:bg-green-500'
                    : 'bg-green-700 dark:bg-green-400'
                }`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div
                key={day}
                className="h-3 flex items-center text-[10px] text-gray-500 dark:text-gray-400"
              >
                {i % 2 === 0 ? day : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-1">
            {heatmapData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip
                    key={`${weekIndex}-${dayIndex}`}
                    content={
                      <div className="text-xs">
                        <div className="font-semibold">
                          {format(new Date(day.date), 'MMM d, yyyy')}
                        </div>
                        <div className="text-gray-400">
                          {day.count} {day.count === 1 ? 'task' : 'tasks'} completed
                        </div>
                      </div>
                    }
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.3, zIndex: 10 }}
                      transition={{
                        delay: (weekIndex * 7 + dayIndex) * 0.005,
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className={`w-3 h-3 rounded cursor-pointer transition-all ${getColor(
                        day.count
                      )} hover:ring-2 hover:ring-blue-500 hover:ring-offset-1`}
                    />
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total Activity
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {data.reduce((sum, d) => sum + d.count, 0)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Active Days
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {data.filter((d) => d.count > 0).length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Best Day
            </p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {maxCount}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Compact version for smaller spaces
export function ActivityHeatmapCompact({ data = [] }: { data?: ActivityData[] }) {
  const last7Days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = subDays(today, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const activity = data.find((d) => d.date === dateStr);
      return { date: dateStr, count: activity?.count || 0 };
    });
  }, [data]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-gray-200 dark:bg-gray-700';
    if (count <= 2) return 'bg-green-300 dark:bg-green-800';
    if (count <= 4) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-400';
  };

  return (
    <div className="flex gap-1">
      {last7Days.map((day, i) => (
        <Tooltip
          key={i}
          content={
            <div className="text-xs">
              <div>{format(new Date(day.date), 'MMM d')}</div>
              <div className="text-gray-400">{day.count} tasks</div>
            </div>
          }
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            transition={{ delay: i * 0.05 }}
            className={`w-2 h-8 rounded-sm ${getColor(day.count)} cursor-pointer`}
          />
        </Tooltip>
      ))}
    </div>
  );
}
