import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { useState } from 'react';

interface FilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
}

interface FilterOptions {
  categories: string[];
  priorities: string[];
  dates: string[];
}

export function FilterDialog({ isOpen, onClose, onApply }: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    priorities: [],
    dates: [],
  });

  const categories = ['Homework', 'Lecture', 'Workshop', 'Event', 'Exam'];
  const priorities = ['High', 'Medium', 'Low'];
  const dates = ['Today', 'Tomorrow', 'This Week', 'This Month'];

  const toggleFilter = (type: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value],
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      categories: [],
      priorities: [],
      dates: [],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4" aria-describedby="filter-dialog-description">
          <span id="filter-dialog-description" className="sr-only">
            Filter your tasks by category, priority, and date
          </span>
          <div>
            <h3 className="mb-3 text-sm">Category</h3>
            <div className="space-y-2">
              {categories.map(cat => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${cat}`}
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={() => toggleFilter('categories', cat)}
                  />
                  <Label htmlFor={`cat-${cat}`} className="text-sm cursor-pointer">
                    {cat}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm">Priority</h3>
            <div className="space-y-2">
              {priorities.map(priority => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={filters.priorities.includes(priority)}
                    onCheckedChange={() => toggleFilter('priorities', priority)}
                  />
                  <Label htmlFor={`priority-${priority}`} className="text-sm cursor-pointer">
                    {priority}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm">Date</h3>
            <div className="space-y-2">
              {dates.map(date => (
                <div key={date} className="flex items-center space-x-2">
                  <Checkbox
                    id={`date-${date}`}
                    checked={filters.dates.includes(date)}
                    onCheckedChange={() => toggleFilter('dates', date)}
                  />
                  <Label htmlFor={`date-${date}`} className="text-sm cursor-pointer">
                    {date}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}