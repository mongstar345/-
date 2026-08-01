import { useMemo, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Skeleton } from '../ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';

interface ChartData {
  date: string;
  completed: number;
  created: number;
  target?: number;
}

interface ProgressChartProps {
  data?: ChartData[];
  period?: 'week' | 'month' | 'year';
}

// Mock data generator (replace with real data from API)
const generateMockData = (days: number): ChartData[] => {
  const data: ChartData[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      completed: Math.floor(Math.random() * 10) + 3,
      created: Math.floor(Math.random() * 8) + 2,
      target: 10,
    });
  }

  return data;
};

export function ProgressChart({ data, period = 'week' }: ProgressChartProps) {
  const days = period === 'week' ? 7 : period === 'month' ? 30 : 365;
  const chartData = useMemo(() => data || generateMockData(days), [data, days]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalCompleted = chartData.reduce((sum, d) => sum + d.completed, 0);
    const totalCreated = chartData.reduce((sum, d) => sum + d.created, 0);
    const avgCompleted = totalCompleted / chartData.length;
    const trend =
      chartData.length > 1
        ? ((chartData[chartData.length - 1].completed - chartData[0].completed) /
            chartData[0].completed) *
          100
        : 0;

    return { totalCompleted, totalCreated, avgCompleted, trend };
  }, [chartData]);

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
            Progress Analytics
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track your productivity over time
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400">Avg/Day</p>
            <p className="font-bold text-gray-900 dark:text-white">
              {stats.avgCompleted.toFixed(1)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 dark:text-gray-400">Trend</p>
            <p
              className={`font-bold ${
                stats.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {stats.trend >= 0 ? '+' : ''}
              {stats.trend.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabs for different chart types */}
      <Tabs defaultValue="line" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="line">Line</TabsTrigger>
          <TabsTrigger value="area">Area</TabsTrigger>
          <TabsTrigger value="bar">Bar</TabsTrigger>
        </TabsList>

        {/* Line Chart */}
        <TabsContent value="line" className="mt-0">
          <Suspense fallback={<ChartSkeleton />}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#22c55e"
                  strokeWidth={3}
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Created"
                />
                {chartData[0]?.target && (
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#9ca3af"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Target"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Suspense>
        </TabsContent>

        {/* Area Chart */}
        <TabsContent value="area" className="mt-0">
          <Suspense fallback={<ChartSkeleton />}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="completed"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#colorCompleted)"
                  name="Completed"
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorCreated)"
                  name="Created"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Suspense>
        </TabsContent>

        {/* Bar Chart */}
        <TabsContent value="bar" className="mt-0">
          <Suspense fallback={<ChartSkeleton />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  stroke="#e5e7eb"
                />
                <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend />
                <Bar
                  dataKey="completed"
                  fill="#22c55e"
                  radius={[8, 8, 0, 0]}
                  name="Completed"
                />
                <Bar
                  dataKey="created"
                  fill="#3b82f6"
                  radius={[8, 8, 0, 0]}
                  name="Created"
                />
              </BarChart>
            </ResponsiveContainer>
          </Suspense>
        </TabsContent>
      </Tabs>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
              Total Completed
            </p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {stats.totalCompleted}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
              Total Created
            </p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {stats.totalCreated}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
