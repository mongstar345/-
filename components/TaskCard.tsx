import { Bell, BellOff, Calendar, Check, Pin, BookOpen, CheckCircle2, LucideIcon, Lock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface Task {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  instructor: string;
  avatar: string;
  color: 'yellow' | 'blue' | 'green' | 'purple' | 'red' | 'pink' | 'orange' | 'brown';
  icons: string[];
  category?: string;
  categoryIcon?: LucideIcon;
  categoryColor?: string;
  priority?: 'high' | 'medium' | 'low';
  isReminderActive?: boolean;
  isDateEditable?: boolean;
}

function getTitleColor(instructor: string): string {
  if (instructor.startsWith('Prof.')) return 'text-purple-600';
  if (instructor.startsWith('Asstprof')) return 'text-blue-600';
  if (instructor.startsWith('Letr')) return 'text-teal-600';
  if (instructor.startsWith('T.A')) return 'text-green-600';
  if (instructor.startsWith('St.')) return 'text-orange-600';
  return 'text-gray-900';
}

export function TaskCard({ task }: { task: Task }) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPinned, setIsPinned] = useState(task.icons.includes('pin'));
  const [reminderActive, setReminderActive] = useState(task.isReminderActive || false);

  const colorClasses = {
    yellow: 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
    blue: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600',
    green: 'bg-gradient-to-br from-green-400 via-green-500 to-emerald-600',
    purple: 'bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600',
    red: 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600',
    pink: 'bg-gradient-to-br from-pink-500 via-pink-600 to-rose-600',
    orange: 'bg-gradient-to-br from-orange-500 via-orange-600 to-red-600',
    brown: 'bg-gradient-to-br from-amber-700 via-amber-800 to-orange-800',
  };

  const priorityIndicator = {
    high: { color: 'bg-red-500', label: 'High Priority', pulse: true },
    medium: { color: 'bg-yellow-500', label: 'Medium Priority', pulse: false },
    low: { color: 'bg-green-500', label: 'Low Priority', pulse: false },
  };

  const handleComplete = () => {
    setIsCompleted(!isCompleted);
    toast.success(isCompleted ? 'Task marked as incomplete' : 'Task completed! 🎉');
  };

  const handlePin = () => {
    setIsPinned(!isPinned);
    toast.success(isPinned ? 'Task unpinned' : 'Task pinned to top');
  };

  const handleReminder = () => {
    setReminderActive(!reminderActive);
    toast.success(reminderActive ? 'Reminder turned off 🔕' : 'Reminder activated 🔔');
  };

  const handleDateEdit = () => {
    if (task.isDateEditable) {
      toast.info('Date editor opened (Feature in development)');
    } else {
      toast.error('This task date cannot be modified');
    }
  };

  const CategoryIcon = task.categoryIcon || BookOpen;
  const priority = task.priority || 'medium';

  return (
    <div className={`${colorClasses[task.color]} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden transition-all duration-300 ${isCompleted ? 'opacity-60 scale-98' : 'hover:shadow-xl hover:scale-[1.02]'}`}>
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
        <BookOpen className="h-32 w-32 transform rotate-12" />
      </div>

      {/* Category Icon Badge - Top Left Corner */}
      <div className="absolute top-3 left-3 z-10">
        <div className={`${task.categoryColor || 'bg-white/20'} backdrop-blur-md rounded-xl p-2 shadow-lg border-2 border-white/30`}>
          <CategoryIcon className="h-5 w-5 text-white drop-shadow-md" />
        </div>
      </div>

      {/* Priority Indicator - Top Right Corner */}
      {task.priority && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <div className={`${priorityIndicator[priority].color} rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm border border-white/30 shadow-md ${priorityIndicator[priority].pulse ? 'animate-pulse' : ''}`}>
            {priorityIndicator[priority].label}
          </div>
        </div>
      )}

      {/* Completed Checkmark Overlay */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20 rounded-2xl">
          <div className="bg-white rounded-full p-4 shadow-2xl animate-in zoom-in duration-300">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
        </div>
      )}

      <div className="relative flex gap-4 mt-8">
        {/* Left Section - Content */}
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-1 drop-shadow-md ${isCompleted ? 'line-through' : ''}`} dir="rtl">
                {task.title}
              </h3>
              <p className="text-sm opacity-90 flex items-center gap-1.5 drop-shadow" dir="rtl">
                <Calendar className="h-3.5 w-3.5" />
                {task.subtitle}
              </p>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-1.5 mb-4 bg-black/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
            <p className="text-sm flex items-center gap-2" dir="rtl">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{task.date}</span>
            </p>
            <p className="text-sm flex items-center gap-2" dir="rtl">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="font-medium">{task.time}</span>
            </p>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* Reminder/Alert Button */}
            {task.icons.includes('alert') && (
              <button 
                onClick={handleReminder}
                className={`backdrop-blur-md rounded-full p-2 transition-all hover:scale-110 border shadow-md ${
                  reminderActive 
                    ? 'bg-white/40 hover:bg-white/50 border-white/50' 
                    : 'bg-white/20 hover:bg-white/30 border-white/30'
                }`}
                title={reminderActive ? 'Reminder Active' : 'Reminder Muted'}
              >
                {reminderActive ? (
                  <Bell className="h-4 w-4 drop-shadow animate-pulse" />
                ) : (
                  <BellOff className="h-4 w-4 drop-shadow" />
                )}
              </button>
            )}

            {/* Calendar/Date Edit Button */}
            {task.icons.includes('calendar') && (
              <button 
                onClick={handleDateEdit}
                disabled={!task.isDateEditable}
                className={`backdrop-blur-md rounded-full p-2 transition-all border shadow-md ${
                  task.isDateEditable
                    ? 'bg-white/20 hover:bg-white/30 hover:scale-110 border-white/30 cursor-pointer'
                    : 'bg-gray-500/40 border-gray-400/40 cursor-not-allowed opacity-60'
                }`}
                title={task.isDateEditable ? 'Edit Date' : 'Date Locked'}
              >
                {task.isDateEditable ? (
                  <Calendar className="h-4 w-4 drop-shadow" />
                ) : (
                  <Lock className="h-4 w-4 drop-shadow" />
                )}
              </button>
            )}

            {/* Complete/Check Button */}
            {task.icons.includes('check') && (
              <button 
                onClick={handleComplete}
                className={`backdrop-blur-md rounded-full p-2 transition-all hover:scale-110 border border-white/30 shadow-md ${
                  isCompleted ? 'bg-white/40 hover:bg-white/50' : 'bg-white/20 hover:bg-white/30'
                }`}
                title={isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
              >
                <Check className="h-4 w-4 drop-shadow" />
              </button>
            )}

            {/* Pin Button */}
            <button 
              onClick={handlePin}
              className={`backdrop-blur-md rounded-full p-2 transition-all hover:scale-110 border border-white/30 shadow-md ${
                isPinned ? 'bg-white/40 hover:bg-white/50' : 'bg-white/20 hover:bg-white/30'
              }`}
              title={isPinned ? 'Unpin Task' : 'Pin to Top'}
            >
              <Pin className={`h-4 w-4 drop-shadow ${isPinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Right Section - Avatar & Instructor */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-white/40 shadow-xl ring-2 ring-white/20">
              <AvatarImage src={task.avatar} />
              <AvatarFallback>{task.instructor[0]}</AvatarFallback>
            </Avatar>
            {/* Online Status Indicator */}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-md"></div>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full bg-white/95 font-semibold shadow-md text-center max-w-[120px] ${getTitleColor(task.instructor)}`}>
            {task.instructor}
          </span>
        </div>
      </div>

      {/* Bottom Progress/Category Indicator */}
      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs opacity-90">
          <CategoryIcon className="h-4 w-4" />
          <span className="font-medium capitalize">{task.category}</span>
        </div>
        <div className="flex items-center gap-1">
          {task.icons.slice(0, 3).map((icon, idx) => (
            <div key={idx} className="w-2 h-2 rounded-full bg-white/50"></div>
          ))}
        </div>
      </div>
    </div>
  );
}