import { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Target, CheckCircle2, Clock, BookOpen, 
  GraduationCap, Activity, Zap, Calendar
} from 'lucide-react';
import { useTasks, useTaskStats } from '../../hooks/useTasks';
import { useTaskStore } from '../../stores/task.store';
import { StatCard } from './StatCard';
import { ProgressRing } from './ProgressRing';
import { TaskList } from './TaskList';
import { ActivityHeatmap } from './ActivityHeatmap';
import { ProgressChart } from './ProgressChart';
import { Skeleton } from '../ui/skeleton';

export function DashboardView() {
  const { filters } = useTaskStore();
  const { data: tasks, isLoading: tasksLoading } = useTasks(filters);
  const { data: stats, isLoading: statsLoading } = useTaskStats();

  const isLoading = tasksLoading || statsLoading;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-24"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="bg-white shadow-sm sticky top-0 z-40 px-4 py-4 border-b"
        variants={itemVariants}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
              {stats?.completionRate || 0}%
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Zap className="h-3 w-3 text-white" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-3"
          variants={itemVariants}
        >
          <StatCard
            icon={Target}
            label="Total Tasks"
            value={stats?.totalTasks || 0}
            color="blue"
            trend={+5}
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={stats?.completedTasks || 0}
            color="green"
            trend={+12}
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={stats?.inProgressTasks || 0}
            color="orange"
          />
          <StatCard
            icon={TrendingUp}
            label="Completion"
            value={`${stats?.completionRate || 0}%`}
            color="purple"
            trend={+8}
          />
        </motion.div>

        {/* Progress Rings */}
        <motion.div 
          className="grid grid-cols-3 gap-3"
          variants={itemVariants}
        >
          <ProgressRing
            value={stats?.dailyCompletionRate || 0}
            label="Daily"
            color="blue"
            icon={Calendar}
          />
          <ProgressRing
            value={stats?.weeklyCompletionRate || 0}
            label="Weekly"
            color="purple"
            icon={Activity}
          />
          <ProgressRing
            value={stats?.completionRate || 0}
            label="Overall"
            color="green"
            icon={TrendingUp}
          />
        </motion.div>

        {/* Charts */}
        <motion.div variants={itemVariants}>
          <ProgressChart />
        </motion.div>

        {/* Activity Heatmap */}
        <motion.div variants={itemVariants}>
          <ActivityHeatmap />
        </motion.div>

        {/* Task List */}
        <motion.div variants={itemVariants}>
          <TaskList tasks={tasks || []} />
        </motion.div>
      </div>
    </motion.div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white shadow-sm px-4 py-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-32 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>

        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Default export for lazy loading
export default DashboardView;