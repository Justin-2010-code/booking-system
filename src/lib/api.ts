import { BookingDate, TimeSlot, Booking } from '@/types';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

// 生成时间段，从9:00到18:00，每30分钟一个时间段
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    // 添加整点时间段
    slots.push({
      id: `${hour}:00-${hour}:30`,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${hour.toString().padStart(2, '0')}:30`,
      isBooked: Math.random() > 0.7 // 随机设置一些时间段为已预约
    });
    
    // 添加半点时间段
    slots.push({
      id: `${hour}:30-${hour + 1}:00`,
      startTime: `${hour.toString().padStart(2, '0')}:30`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      isBooked: Math.random() > 0.7 // 随机设置一些时间段为已预约
    });
  }
  
  return slots;
};

// 获取未来7天的可预约日期
export const getAvailableDates = async (): Promise<string[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }
  
  return dates;
};

// 获取指定日期的时间段
export const getTimeSlotsForDate = async (date: string): Promise<TimeSlot[]> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 模拟从服务器获取时间段
  // 在实际应用中，这里应该调用后端API
  return generateTimeSlots();
};

// 创建预约
export const createBooking = async (data: {
  date: string;
  timeSlot: TimeSlot;
  userInfo: {
    name: string;
    phone: string;
    alternativeContact?: string;
    notes?: string;
  };
}): Promise<Booking> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 模拟创建预约
  // 在实际应用中，这里应该调用后端API
  return {
    id: Math.random().toString(36).substring(2, 10).toUpperCase(),
    date: data.date,
    timeSlot: data.timeSlot,
    userInfo: data.userInfo,
    createdAt: new Date().toISOString(),
  };
};