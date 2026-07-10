'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch('/api/session', { method: 'DELETE' });
    localStorage.removeItem('silver-health-last-sync');
    navigator.serviceWorker?.controller?.postMessage({ type: 'CLEAR_APP_CACHE' });
    router.replace('/access');
    router.refresh();
  }

  return (
    <button type="button" className="button button--secondary button--block" onClick={logout} disabled={loading} data-touch-target>
      <LogOut aria-hidden="true" />{loading ? '正在退出…' : '退出体验账号'}
    </button>
  );
}
