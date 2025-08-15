'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  AlertCircle,
} from 'lucide-react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  participants: number;
  disabled?: boolean;
  className?: string;
}

interface AvailabilityData {
  date: string;
  totalParticipants: number;
  remainingSlots: number;
  isFullyBooked: boolean;
  maxParticipantsPerDay: number;
}

const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onDateChange,
  participants,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availability, setAvailability] = useState<
    Record<string, AvailabilityData>
  >({});
  const [loading, setLoading] = useState(false);

  // Get month start and end dates
  const getMonthStart = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1);
  const getMonthEnd = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0);

  // Fetch availability for current month
  const fetchAvailability = useCallback(async (month: Date) => {
    setLoading(true);
    try {
      const startDate = getMonthStart(month).toISOString().split('T')[0];
      const endDate = getMonthEnd(month).toISOString().split('T')[0];

      const response = await fetch('/api/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (response.ok) {
        const { availability } = await response.json();
        const availabilityMap: Record<string, AvailabilityData> = {};
        availability.forEach((item: AvailabilityData) => {
          availabilityMap[item.date] = item;
        });
        setAvailability(availabilityMap);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch availability when month changes
  useEffect(() => {
    fetchAvailability(currentMonth);
  }, [currentMonth, fetchAvailability]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const dateStr = date.toISOString().split('T')[0];
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.getTime() === today.getTime();
      const isSelected = dateStr === selectedDate;
      const isPast = date < today;

      const dayAvailability = dateStr ? availability[dateStr] : undefined;
      const isAvailable = dayAvailability && !dayAvailability.isFullyBooked;
      const hasEnoughSlots =
        dayAvailability && dayAvailability.remainingSlots >= participants;
      const isDisabled = isPast || !isAvailable || !hasEnoughSlots;

      days.push({
        date,
        dateStr,
        isCurrentMonth,
        isToday,
        isSelected,
        isDisabled,
        availability: dayAvailability,
      });
    }

    return days;
  };

  const handleDateSelect = (dateStr: string) => {
    const dayAvailability = dateStr ? availability[dateStr] : undefined;
    if (dayAvailability && dayAvailability.remainingSlots >= participants) {
      onDateChange(dateStr);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const days = generateCalendarDays();

  return (
    <div className={`relative ${className}`}>
      {/* Date Input */}
      <motion.button
        type='button'
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
          isOpen
            ? 'ring-2 ring-blue-500 border-transparent'
            : 'hover:border-blue-400'
        }`}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Calendar className='w-5 h-5 text-gray-500' />
            <span className={selectedDate ? 'text-gray-900' : 'text-gray-500'}>
              {selectedDate
                ? formatDate(selectedDate)
                : 'Select your preferred date'}
            </span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className='w-5 h-5 text-gray-500' />
          </motion.div>
        </div>
      </motion.button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className='absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden'
          >
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-100'>
              <motion.button
                onClick={() => navigateMonth('prev')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <ChevronLeft className='w-5 h-5' />
              </motion.button>

              <h3 className='text-lg font-semibold text-gray-900'>
                {currentMonth.toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h3>

              <motion.button
                onClick={() => navigateMonth('next')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <ChevronRight className='w-5 h-5' />
              </motion.button>
            </div>

            {/* Calendar Grid */}
            <div className='p-4'>
              {/* Weekday Headers */}
              <div className='grid grid-cols-7 gap-1 mb-2'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div
                    key={day}
                    className='text-center text-sm font-medium text-gray-500 py-2'
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className='grid grid-cols-7 gap-1'>
                {days.map((day, index) => (
                  <motion.button
                    key={index}
                    onClick={() =>
                      !day.isDisabled &&
                      day.dateStr &&
                      handleDateSelect(day.dateStr)
                    }
                    disabled={day.isDisabled}
                    className={`relative p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      day.isSelected
                        ? 'bg-blue-600 text-white shadow-lg'
                        : day.isToday
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : day.isCurrentMonth
                            ? day.isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-900 hover:bg-gray-100'
                            : 'text-gray-400'
                    }`}
                    whileHover={!day.isDisabled ? { scale: 1.1 } : {}}
                    whileTap={!day.isDisabled ? { scale: 0.95 } : {}}
                  >
                    <span>{day.date.getDate()}</span>

                    {/* Availability Indicator */}
                    {day.availability && day.isCurrentMonth && (
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2'>
                        <div
                          className={`w-1 h-1 rounded-full ${
                            day.availability.isFullyBooked
                              ? 'bg-red-500'
                              : day.availability.remainingSlots < 5
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                          }`}
                        />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Availability Legend */}
              <div className='mt-4 pt-4 border-t border-gray-100'>
                <div className='flex items-center justify-between text-xs text-gray-600'>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                    <span>Available</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-yellow-500 rounded-full' />
                    <span>Limited spots</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <div className='w-2 h-2 bg-red-500 rounded-full' />
                    <span>Fully booked</span>
                  </div>
                </div>
              </div>

              {/* Selected Date Info */}
              {selectedDate && availability[selectedDate] && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='mt-4 p-3 bg-blue-50 rounded-lg'
                >
                  <div className='flex items-center gap-2 text-sm'>
                    <Users className='w-4 h-4 text-blue-600' />
                    <span className='text-blue-800'>
                      {availability[selectedDate].remainingSlots} spots
                      remaining for {formatDate(selectedDate)}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg'
        >
          <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600' />
        </motion.div>
      )}
    </div>
  );
};

export default DatePicker;
