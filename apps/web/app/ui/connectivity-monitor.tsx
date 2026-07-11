'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import {
  connectivityChangeEvent,
  connectivityCheckEvent,
  connectivityStorageKey,
  probeNetworkConnection,
  shouldRefreshOnReconnect,
} from '../../lib/connection-state';

export type ConnectivityDetail = { online: boolean; lastSync: string };

export function ConnectivityMonitor() {
  const router = useRouter();
  const previousOnline = useRef<boolean | null>(null);
  const probeSequence = useRef(0);

  const publish = useCallback((online: boolean) => {
    const lastSync = online
      ? new Date().toISOString()
      : localStorage.getItem('silver-health-last-sync') || '';
    localStorage.setItem(connectivityStorageKey, online ? 'online' : 'offline');
    if (online) localStorage.setItem('silver-health-last-sync', lastSync);
    window.dispatchEvent(new CustomEvent<ConnectivityDetail>(connectivityChangeEvent, {
      detail: { online, lastSync },
    }));

    if (previousOnline.current !== null && shouldRefreshOnReconnect(previousOnline.current, online)) {
      router.refresh();
    }
    previousOnline.current = online;
  }, [router]);

  const check = useCallback(async () => {
    const sequence = ++probeSequence.current;
    const online = navigator.onLine && await probeNetworkConnection();
    if (sequence === probeSequence.current) publish(online);
    return online;
  }, [publish]);

  useEffect(() => {
    const handleOffline = () => publish(false);
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') void check();
    };
    const handleCheckRequest = () => void check();

    void check();
    window.addEventListener('online', check);
    window.addEventListener('offline', handleOffline);
    window.addEventListener(connectivityCheckEvent, handleCheckRequest);
    document.addEventListener('visibilitychange', handleVisibility);
    const intervalId = window.setInterval(() => void check(), 15_000);

    return () => {
      window.removeEventListener('online', check);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(connectivityCheckEvent, handleCheckRequest);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.clearInterval(intervalId);
    };
  }, [check, publish]);

  return null;
}
