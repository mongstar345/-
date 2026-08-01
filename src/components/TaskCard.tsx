import { motion } from 'motion/react';
import { Clock, User, Tag, MoreVertical } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
}

const priorityColors = {
  high: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  medium: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  low: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
};

const statusColors = {
  pending: 'text-gray-600 bg-gray-50 dark:bg-gray-800',
  in_progress: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  completed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            {task.title}
          </h3>
          {task.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {task.subtitle}
            </p>
          )}
        </div>
        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[task.status]}`}
        >
          {task.status.replace('_', ' ')}
        </span>
        {task.category && (
          <span className="text-xs px-2 py-1 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 font-medium">
            <Tag className="h-3 w-3 inline mr-1" />
            {task.category}
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
        {task.date && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(task.date).toLocaleDateString()}
          </div>
        )}
        {task.instructor && (
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {task.instructor}
          </div>
        )}
      </div>
    </motion.div>
  );
}
