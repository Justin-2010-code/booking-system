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

      // 显示预约确认
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

  // 如果有预约确认，显示确认页面
  if (bookingConfirmation) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <BookingConfirmation booking={bookingConfirmation} onReset={handleReset} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">在线预约系统</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">选择日期和时间，填写信息即可完成预约</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <p className="text-red-600 dark:text-red-400">{error}</p>
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
            <TimeSlotPicker 
              selectedDate={formattedDate} 
              onSelectTimeSlot={handleTimeSlotSelect} 
              selectedTimeSlot={selectedTimeSlot} 
            />
          </div>

          <div>
            {/* 用户信息表单 */}
            <UserInfoForm 
              onSubmit={handleFormSubmit} 
              isSubmitting={isSubmitting} 
            />

            {/* 预约摘要 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">预约摘要</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">日期：</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {selectedDate ? format(selectedDate, 'yyyy年MM月dd日') : '未选择'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">时间段：</span>
                  <span className="font-medium text-gray-800 dark:text-white">
                    {selectedTimeSlot ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}` : '未选择'}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  请确保选择了日期和时间段，并填写了必要的个人信息后再提交预约。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
