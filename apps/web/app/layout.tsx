import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AppNavigation } from './ui/app-navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silver Health App',
  description: '老年健康管理 MVP 应用',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}
