import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { AppNavigation } from './ui/app-navigation';
import { ConnectivityMonitor } from './ui/connectivity-monitor';
import { PwaRegister } from './ui/pwa-register';
import './globals.css';

export const metadata: Metadata = {
  title: 'Silver Health',
  description: '面向老人和家人的日常健康管理应用',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Silver Health',
  },
};

export const viewport: Viewport = {
  themeColor: '#176b87',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <PwaRegister />
        <ConnectivityMonitor />
        <AppNavigation />
        <div className="app-content">{children}</div>
      </body>
    </html>
  );
}
