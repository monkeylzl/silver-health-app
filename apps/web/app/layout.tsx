import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppNavigation } from './ui/app-navigation';
import { PwaRegister } from './ui/pwa-register';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silver Health',
  description: '面向老人和家属的健康管理 PWA',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Silver Health',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <PwaRegister />
        <AppNavigation />
        {children}
      </body>
    </html>
  );
}
