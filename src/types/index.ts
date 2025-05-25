// 定义预约系统的类型

// 时间段类型
export interface TimeSlot {
  id: string;
  startTime: string; // 格式: "HH:MM"
  endTime: string; // 格式: "HH:MM"
  isBooked: boolean;
}

// 预约日期类型
export interface BookingDate {
  date: string; // 格式: "YYYY-MM-DD"
  timeSlots: TimeSlot[];
}

// 用户信息类型
export interface UserInfo {
  name: string;
  phone: string;
  alternativeContact?: string;
  notes?: string;
}

// 预约信息类型
export interface Booking {
  id: string;
  date: string;
  timeSlot: TimeSlot;
  userInfo: UserInfo;
  createdAt: string;
}
