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
  
  // 检查日期是否是过去的日期
  const selectedDate = new Date(date);
  const today = startOfDay(new Date());
  
  if (isBefore(selectedDate, today)) {
    throw new Error('不能选择过去的日期');
  }
  
  return generateTimeSlots();
};

// 创建预约
export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟创建预约
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substring(2, 9),
    createdAt: new Date().toISOString()
  };
  
  return newBooking;
};