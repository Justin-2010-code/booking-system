'use client';

import { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, startOfDay, isSameDay } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  onSelectDate: (date: string) => void;
  selectedDate: Date | undefined;
}

export default function DatePicker({ onSelectDate, selectedDate }: DatePickerProps) {
  const today = startOfDay(new Date());
  
  // 禁用过去的日期
  const disabledDays = { before: today };
  
  // 处理日期选择
  const handleDayClick = (day: Date | undefined) => {
    if (day) {
      onSelectDate(format(day, 'yyyy-MM-dd'));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">选择日期</h2>
      <div className="rdp-wrapper">
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDayClick}
          disabled={disabledDays}
          locale={zhCN}
          modifiersClassNames={{
            selected: 'bg-blue-600 text-white rounded-full',
            today: 'text-red-600 font-bold',
            disabled: 'text-gray-400 line-through cursor-not-allowed'
          }}
          className="border rounded-md p-2"
          showOutsideDays
          fixedWeeks
        />
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <p>• 灰色日期不可选择（过去的日期）</p>
        <p>• 蓝色背景表示当前选中日期</p>
      </div>
    </div>
  );
}