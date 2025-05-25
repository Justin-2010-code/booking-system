'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import DatePicker from '@/components/DatePicker';
import TimeSlotPicker from '@/components/TimeSlotPicker';
import UserInfoForm from '@/components/UserInfoForm';
import BookingConfirmation from '@/components/BookingConfirmation';
import { TimeSlot, UserInfo, Booking } from '@/types';
import { createBooking } from '@/lib/api';

export default function Home() {
  // 状态管理
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 处理日期选择
  const handleDateSelect = (date: string) => {
    setFormattedDate(date);
    setSelectedDate(new Date(date));
    setSelectedTimeSlot(null);
  };

  // 处理时间段选择
  const handleTimeSlotSelect = (timeSlot: TimeSlot | null) => {
    setSelectedTimeSlot(timeSlot);
  };

  // 处理表单提交
  const handleFormSubmit = async (userInfo: UserInfo) => {
    if (!formattedDate || !selectedTimeSlot) {
      setError('请选择预约日期和时间段');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 创建预约
      const booking = await createBooking({
        date: formattedDate,
        timeSlot: selectedTimeSlot,
        userInfo,
      });

      setBookingConfirmation(booking);
    } catch (err) {
      setError(err instanceof Error ? err.message : '预约提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 重置预约流程
  const handleReset = () => {
    setSelectedDate(undefined);
    setFormattedDate(null);
    setSelectedTimeSlot(null);
    setBookingConfirmation(null);
    setError(null);
  };

  // 如果有预约确认信息，显示确认页面
  if (bookingConfirmation) {
    return <BookingConfirmation booking={bookingConfirmation} onReset={handleReset} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">在线预约系统</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {/* 日期选择器 */}
            <DatePicker 
              onSelectDate={handleDateSelect} 
              selectedDate={selectedDate} 
            />
            
            {/* 时间段选择器 */}
            {formattedDate && (
              <TimeSlotPicker 
                selectedDate={formattedDate}
                onSelectTimeSlot={handleTimeSlotSelect}
                selectedTimeSlot={selectedTimeSlot}
              />
            )}
          </div>
          
          <div>
            {/* 用户信息表单 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">填写预约信息</h2>
              <UserInfoForm 
                onSubmit={handleFormSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
            
            {/* 预约摘要 */}
            {formattedDate && selectedTimeSlot && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">预约摘要</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">日期:</span>
                    <span className="font-medium">{format(new Date(formattedDate), 'yyyy年MM月dd日')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">时间:</span>
                    <span className="font-medium">{selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}