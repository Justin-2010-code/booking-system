'use client';

import { useState, useEffect } from 'react';
import { TimeSlot } from '@/types';
import { getTimeSlotsForDate } from '@/lib/api';

interface TimeSlotPickerProps {
  selectedDate: string | null;
  onSelectTimeSlot: (timeSlot: TimeSlot | null) => void;
  selectedTimeSlot: TimeSlot | null;
}

export default function TimeSlotPicker({ 
  selectedDate, 
  onSelectTimeSlot,
  selectedTimeSlot 
}: TimeSlotPickerProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 当选择的日期变化时，获取该日期的时间段
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      onSelectTimeSlot(null);
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      setError(null);
      try {
        const slots = await getTimeSlotsForDate(selectedDate);
        setTimeSlots(slots);
        // 如果之前选择的时间段不在新的时间段列表中，清除选择
        if (selectedTimeSlot && !slots.find(slot => slot.id === selectedTimeSlot.id)) {
          onSelectTimeSlot(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取时间段失败');
        setTimeSlots([]);
        onSelectTimeSlot(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, onSelectTimeSlot, selectedTimeSlot]);

  // 处理时间段选择
  const handleTimeSlotClick = (timeSlot: TimeSlot) => {
    if (!timeSlot.isBooked) {
      onSelectTimeSlot(timeSlot);
    }
  };

  if (!selectedDate) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择时间段</h2>
        <p className="text-gray-500 dark:text-gray-400">请先选择日期</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择时间段</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择时间段</h2>
        <div className="text-red-500 p-4 rounded-md bg-red-50 dark:bg-red-900/20">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择时间段</h2>
      
      {timeSlots.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">当天没有可用的时间段</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleTimeSlotClick(slot)}
              disabled={slot.isBooked}
              className={`
                py-2 px-3 rounded-md text-sm font-medium transition-colors
                ${slot.isBooked 
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 cursor-not-allowed' 
                  : selectedTimeSlot?.id === slot.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
            >
              {slot.startTime} - {slot.endTime}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>• 红色时间段表示已被预约</p>
        <p>• 蓝色背景表示当前选中时间段</p>
      </div>
    </div>
  );
}