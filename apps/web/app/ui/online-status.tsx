'use client';

import { ChevronRight, Cloud, CloudOff, RefreshCw, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  connectivityChangeEvent,
  connectivityCheckEvent,
  connectivityStorageKey,
  getNetworkSettingsInstruction,
  probeNetworkConnection,
} from '../../lib/connection-state';
import type { ConnectivityDetail } from './connectivity-monitor';

export function OnlineStatus() {
  const router = useRouter();
  const [online, setOnline] = useState(true);
  const [lastSync, setLastSync] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [checkMessage, setCheckMessage] = useState('');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const storedStatus = localStorage.getItem(connectivityStorageKey);
    if (storedStatus) setOnline(storedStatus === 'online');
    setLastSync(localStorage.getItem('silver-health-last-sync') || '');

    const update = (event: Event) => {
      const { online: currentOnline, lastSync: currentLastSync } = (event as CustomEvent<ConnectivityDetail>).detail;
      setOnline(currentOnline);
      setLastSync(currentLastSync);
      if (currentOnline) {
        setHelpOpen(false);
        setCheckMessage('');
      }
    };
    window.addEventListener(connectivityChangeEvent, update);
    window.dispatchEvent(new Event(connectivityCheckEvent));
    return () => {
      window.removeEventListener(connectivityChangeEvent, update);
    };
  }, []);

  useEffect(() => {
    if (!helpOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHelpOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [helpOpen]);

  const statusDetails = (
    <>
      {online ? <Cloud aria-hidden="true" /> : <CloudOff aria-hidden="true" />}
      <div>
        <strong>{online ? '已连接' : '离线浏览'}</strong>
        <span>{online ? '健康数据会正常同步' : lastSync ? `上次同步：${new Date(lastSync).toLocaleString('zh-CN')}` : '恢复网络后可继续操作'}</span>
      </div>
    </>
  );

  const retryConnection = async () => {
    setChecking(true);
    const connected = navigator.onLine && await probeNetworkConnection();
    setChecking(false);
    if (connected) {
      const timestamp = new Date().toISOString();
      localStorage.setItem(connectivityStorageKey, 'online');
      localStorage.setItem('silver-health-last-sync', timestamp);
      setOnline(true);
      setLastSync(timestamp);
      setHelpOpen(false);
      setCheckMessage('');
      router.refresh();
      return;
    }
    setOnline(false);
    localStorage.setItem(connectivityStorageKey, 'offline');
    setCheckMessage('仍未连接，请检查系统网络设置。');
  };

  return (
    <>
      {online ? (
        <div className="connection-status" role="status">{statusDetails}</div>
      ) : (
        <button
          type="button"
          className="connection-status connection-status--offline connection-status--action"
          aria-haspopup="dialog"
          aria-expanded={helpOpen}
          onClick={() => setHelpOpen(true)}
          data-touch-target
        >
          {statusDetails}
          <ChevronRight className="connection-status__chevron" aria-hidden="true" />
        </button>
      )}

      {helpOpen ? (
        <div className="network-help-backdrop" onClick={() => setHelpOpen(false)}>
          <section
            className="network-help-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-help-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="network-help-dialog__header">
              <div>
                <span className="network-help-dialog__icon" aria-hidden="true"><CloudOff /></span>
                <h2 id="network-help-title">连接网络</h2>
              </div>
              <button type="button" className="icon-button" aria-label="关闭网络帮助" title="关闭" onClick={() => setHelpOpen(false)}>
                <X aria-hidden="true" />
              </button>
            </div>
            <p>{getNetworkSettingsInstruction(navigator.userAgent)}</p>
            <p className="network-help-dialog__note">受系统限制，网页应用不能直接打开网络设置。</p>
            {checkMessage ? <p className="form-message form-message--error" aria-live="polite">{checkMessage}</p> : null}
            <button type="button" className="button button--primary network-help-dialog__retry" onClick={retryConnection} disabled={checking} data-touch-target>
              <RefreshCw aria-hidden="true" />{checking ? '正在检测' : '重新检测'}
            </button>
          </section>
        </div>
      ) : null}
    </>
  );
}
