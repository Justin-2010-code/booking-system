'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserInfo } from '@/types';

// 定义表单验证模式
const userInfoSchema = z.object({
  name: z.string()
    .min(2, { message: '姓名至少需要2个字符' })
    .regex(/^[\u4e00-\u9fa5a-zA-Z\s]+$/, { message: '姓名只能包含中文、英文字母和空格' }),
  
  phone: z.string()
    .regex(/^\d{3}-?\d{4}-?\d{4}$/, { message: '请输入有效的手机号码，格式为XXX-XXXX-XXXX' }),
  
  alternativeContact: z.string().optional(),
  
  notes: z.string()
    .max(500, { message: '备注不能超过500个字符' })
    .optional(),
});

type UserInfoFormData = z.infer<typeof userInfoSchema>;

interface UserInfoFormProps {
  onSubmit: (data: UserInfo) => void;
  isSubmitting: boolean;
}

export default function UserInfoForm({ onSubmit, isSubmitting }: UserInfoFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
  } = useForm<UserInfoFormData>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      name: '',
      phone: '',
      alternativeContact: '',
      notes: '',
    },
  });

  // 监听手机号输入，自动格式化
  const phoneValue = watch('phone');
  
  // 处理手机号格式化
  const formatPhoneNumber = (value: string) => {
    // 移除所有非数字字符
    const digits = value.replace(/\D/g, '');
    
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 7) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    }
  };

  // 处理表单提交
  const handleFormSubmit = (data: UserInfoFormData) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">填写个人信息</h2>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* 姓名字段 */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            姓名 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="请输入您的姓名"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500" role="alert">{errors.name.message}</p>
          )}
        </div>

        {/* 手机号字段 */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            手机号 <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            onChange={(e) => {
              const formatted = formatPhoneNumber(e.target.value);
              e.target.value = formatted;
            }}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="例如：138-1234-5678"
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500" role="alert">{errors.phone.message}</p>
          )}
        </div>

        {/* 备用联系方式字段 */}
        <div>
          <label htmlFor="alternativeContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            备用联系方式（选填）
          </label>
          <input
            id="alternativeContact"
            type="text"
            {...register('alternativeContact')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            placeholder="微信号或邮箱"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">可填写微信号或邮箱地址</p>
        </div>

        {/* 咨询备注字段 */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            咨询备注（选填）
          </label>
          <textarea
            id="notes"
            {...register('notes')}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${errors.notes ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`}
            placeholder="请输入您的咨询内容或特殊需求"
          />
          <div className="flex justify-between mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">最多500字</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {watch('notes')?.length || 0}/500
            </p>
          </div>
          {errors.notes && (
            <p className="mt-1 text-sm text-red-500" role="alert">{errors.notes.message}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                提交中...
              </span>
            ) : '提交预约'}
          </button>
        </div>
      </form>
    </div>
  );
}