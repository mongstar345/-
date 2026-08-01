import { useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { Task } from '../../types';
import { TaskCard } from '../TaskCard';
import { useTaskStore } from '../../stores/task.store';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const { filters } = useTaskStore();

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Apply filters
    if (filters.category !== 'all') {
      result = result.filter((task) => task.category === filters.category);
    }

    if (filters.priority !== 'all') {
      result = result.filter((task) => task.priority === filters.priority);
    }

    if (filters.status !== 'all') {
      result = result.filter((task) => task.status === filters.status);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.subtitle?.toLowerCase().includes(searchLower) ||
          task.instructor?.toLowerCase().includes(searchLower)
      );
    }

    // Sort: pinned first, then by priority, then by date
    result.sort((a, b) => {
      // Pinned tasks first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by date (earliest first)
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return result;
  }, [tasks, filters]);

  // Virtual scrolling setup
  const virtualizer = useVirtualizer({
    count: filteredTasks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // Estimated task card height
    overscan: 3, // Render 3 extra items above and below viewport
  });

  const virtualItems = virtualizer.getVirtualItems();

  if (filteredTasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">No tasks found</h3>
        <p className="text-gray-500 text-sm">
          {filters.search || filters.category !== 'all'
            ? 'Try adjusting your filters'
            : 'Create your first task to get started'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tasks
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredTasks.length})
          </span>
        </h2>
      </div>

      {/* Virtual List Container */}
      <div
        ref={parentRef}
        className="h-[600px] overflow-auto rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-2"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#cbd5e1 transparent',
        }}
      >
        <div
          style={{
            height: virtualizer.getTotalSize(),
            width: '100%',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="popLayout">
            {virtualItems.map((virtualRow) => {
              const task = filteredTasks[virtualRow.index];
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{
                    duration: 0.2,
                    delay: virtualRow.index * 0.03,
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: virtualRow.size,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="px-2 pb-3">
                    <TaskCard task={task} />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 text-xs text-gray-500"
      >
        <div>
          <span className="font-semibold text-green-600">
            {filteredTasks.filter((t) => t.status === 'completed').length}
          </span>{' '}
          completed
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div>
          <span className="font-semibold text-orange-600">
            {filteredTasks.filter((t) => t.status === 'in_progress').length}
          </span>{' '}
          in progress
        </div>
        <div className="w-px h-4 bg-gray-300" />
        <div>
          <span className="font-semibold text-gray-600">
            {filteredTasks.filter((t) => t.status === 'pending').length}
          </span>{' '}
          pending
        </div>
      </motion.div>
    </div>
  );
}

// Alternative: Drag & Drop version (for manual ordering)
export function TaskListDraggable({ tasks }: TaskListProps) {
  const [items, setItems] = useState(tasks);

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      className="space-y-3"
    >
      {items.map((task) => (
        <Reorder.Item
          key={task.id}
          value={task}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileDrag={{
            scale: 1.05,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            cursor: 'grabbing',
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          <TaskCard task={task} />
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
