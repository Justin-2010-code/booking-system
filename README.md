# 预约系统 (Booking System)

这是一个基于Next.js开发的现代化预约系统，提供直观的用户界面和强大的预约管理功能。

## 主要功能

### 时间选择功能
- 智能日期选择器：用户可以轻松选择可用的日期
- 精细化时间区块：按30分钟间隔划分的时间选择
- 动态加载逻辑：根据选择的日期动态显示可用时间段

### 用户信息收集表单
- 必填字段：姓名、联系方式、预约项目
- 选填字段：备注信息
- 智能验证功能：确保用户输入有效信息

## 技术栈

- **前端框架**：Next.js 14
- **UI库**：React
- **类型系统**：TypeScript
- **样式解决方案**：Tailwind CSS

## 本地运行

首先，运行开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
# 或
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 项目结构

- `src/app`：页面和路由
- `src/components`：可复用组件
- `src/lib`：工具函数和辅助库
- `src/types`：TypeScript类型定义

---

## 关于Next.js

这是一个使用 [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) 引导的 [Next.js](https://nextjs.org) 项目。

### 了解更多

要了解有关Next.js的更多信息，请查看以下资源：

- [Next.js文档](https://nextjs.org/docs) - 了解Next.js功能和API。
- [学习Next.js](https://nextjs.org/learn) - 交互式Next.js教程。

您可以查看[Next.js GitHub仓库](https://github.com/vercel/next.js) - 欢迎您的反馈和贡献！
