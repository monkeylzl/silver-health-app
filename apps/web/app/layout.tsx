import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Silver Health App',
  description: '老年健康管理 MVP 应用',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#f7f8fa' }}>
        {children}
      </body>
    </html>
  );
}
