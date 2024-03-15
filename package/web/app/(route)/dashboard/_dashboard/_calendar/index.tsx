import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export default function Calendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth === 0 ? 11 : prevMonth - 1));
    setCurrentYear(prevYear => (currentMonth === 0 ? prevYear - 1 : prevYear));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => (prevMonth === 11 ? 0 : prevMonth + 1));
    setCurrentYear(prevYear => (currentMonth === 11 ? prevYear + 1 : prevYear));
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const lastDayOfMonth = new Date(
    currentYear,
    currentMonth,
    daysInMonth,
  ).getDay();
  const emptyBoxesBefore = new Array(firstDayOfMonth).fill(0);
  const emptyBoxesAfter = new Array(6 - lastDayOfMonth).fill(0);

  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1,
  );

  return (
    <div className="flex flex-1 flex-col space-y-2">
      <div className="mb-2 flex items-center justify-center space-x-4">
        <Button size="icon" variant="outline" onClick={handlePrevMonth}>
          <ChevronLeft />
        </Button>
        <Button variant="outline">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </Button>
        <Button size="icon" variant="outline" onClick={handleNextMonth}>
          <ChevronRight />
        </Button>
      </div>
      <div className="grid grid-cols-7 rounded-lg bg-white dark:bg-card">
        {daysOfWeek.map(day => (
          <div key={day} className="p-4 text-left font-semibold">
            {day}
          </div>
        ))}
      </div>
      <div className="flex flex-1">
        <div className="grid flex-1 grid-cols-7 rounded-b-lg bg-slate-50 dark:bg-card">
          {emptyBoxesBefore.map((_, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 text-left font-medium text-gray-300"
            >
              {prevMonthDays - firstDayOfMonth + index + 1}
            </div>
          ))}
          {Array.from({ length: daysInMonth }, (_, index) => (
            <div
              key={index}
              className="border border-gray-300 p-4 text-left font-medium text-gray-600"
            >
              {index + 1}
            </div>
          ))}
          {emptyBoxesAfter.map((_, index) => (
            <div
              key={`empty-after-${index}`}
              className="border border-gray-300 p-4 text-left font-medium text-gray-300"
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
