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
  
  // 处理表单提交
  const onSubmitForm = (data: UserInfoFormData) => {
    // 格式化手机号
    const formattedPhone = data.phone.replace(/-/g, '');
    const phone = `${formattedPhone.slice(0, 3)}-${formattedPhone.slice(3, 7)}-${formattedPhone.slice(7)}`;
    
    onSubmit({
      ...data,
      phone,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      {/* 姓名 */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入您的姓名"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* 手机号 */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          手机号码 <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="请输入您的手机号码"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          格式：XXX-XXXX-XXXX，例如：138-1234-5678
        </p>
      </div>

      {/* 备用联系方式 */}
      <div>
        <label htmlFor="alternativeContact" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          备用联系方式
        </label>
        <input
          id="alternativeContact"
          type="text"
          {...register('alternativeContact')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="可选，如微信、邮箱等"
        />
      </div>

      {/* 备注 */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          备注信息
        </label>
        <textarea
          id="notes"
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="可选，如有特殊需求请在此说明"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {/* 提交按钮 */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              提交中...
            </>
          ) : '提交预约'}
        </button>
      </div>
    </form>
  );
}