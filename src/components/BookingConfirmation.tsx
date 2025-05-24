'use client';

import { Booking } from '@/types';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface BookingConfirmationProps {
  booking: Booking;
  onReset: () => void;
}

export default function BookingConfirmation({ booking, onReset }: BookingConfirmationProps) {
  // 格式化日期显示
  const formattedDate = format(new Date(booking.date), 'yyyy年MM月dd日 EEEE', { locale: zhCN });
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">预约成功！</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">您的预约已成功提交</p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">预约详情</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">预约编号：</span>
            <span className="font-medium text-gray-800 dark:text-white">{booking.id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">预约日期：</span>
            <span className="font-medium text-gray-800 dark:text-white">{formattedDate}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">预约时间：</span>
            <span className="font-medium text-gray-800 dark:text-white">
              {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">姓名：</span>
            <span className="font-medium text-gray-800 dark:text-white">{booking.userInfo.name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">联系电话：</span>
            <span className="font-medium text-gray-800 dark:text-white">{booking.userInfo.phone}</span>
          </div>
          
          {booking.userInfo.alternativeContact && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">备用联系方式：</span>
              <span className="font-medium text-gray-800 dark:text-white">{booking.userInfo.alternativeContact}</span>
            </div>
          )}
          
          {booking.userInfo.notes && (
            <div className="flex flex-col">
              <span className="text-gray-600 dark:text-gray-400 mb-1">备注：</span>
              <p className="font-medium text-gray-800 dark:text-white bg-white dark:bg-gray-800 p-2 rounded">
                {booking.userInfo.notes}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          我们已将预约确认信息发送到您的手机，请保持电话畅通。
        </p>
        
        <button
          onClick={onReset}
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
}