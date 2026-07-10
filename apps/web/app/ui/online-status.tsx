'use client';

import { Cloud, CloudOff } from 'lucide-react';
import { useEffect, useState } from 'react';

export function OnlineStatus() {
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState('');

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine);
      if (navigator.onLine) {
        const timestamp = new Date().toISOString();
        localStorage.setItem('silver-health-last-sync', timestamp);
        setLastSync(timestamp);
      } else {
        setLastSync(localStorage.getItem('silver-health-last-sync') || '');
      }
    };
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <div className={online ? 'connection-status' : 'connection-status connection-status--offline'} role="status">
      {online ? <Cloud aria-hidden="true" /> : <CloudOff aria-hidden="true" />}
      <div>
        <strong>{online ? '已连接' : '离线浏览'}</strong>
        <span>{online ? '健康数据会正常同步' : lastSync ? `上次同步：${new Date(lastSync).toLocaleString('zh-CN')}` : '恢复网络后可继续操作'}</span>
      </div>
    </div>
  );
}
