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
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    onSelectTimeSlot(timeSlot);
  };

  // 如果没有选择日期，不显示时间段选择器
  if (!selectedDate) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择时间段</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-300">加载中...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      ) : timeSlots.length === 0 ? (
        <div className="text-center py-8 text-gray-600 dark:text-gray-300">
          当前日期没有可用的时间段
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {timeSlots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleTimeSlotSelect(slot)}
              disabled={slot.isBooked}
              className={`
                py-3 px-4 rounded-md text-sm font-medium transition-colors
                ${slot.isBooked 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : selectedTimeSlot?.id === slot.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              {slot.startTime} - {slot.endTime}
              {slot.isBooked && (
                <span className="block text-xs mt-1 text-red-500">已预约</span>
              )}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>• 灰色时间段表示已被预约</p>
        <p>• 蓝色背景表示当前选中时间段</p>
      </div>
    </div>
  );
}