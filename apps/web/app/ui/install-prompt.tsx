'use client';

import { useEffect, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
}

export function InstallPrompt({ compact = false }: { compact?: boolean }) {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const onBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };

    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  };

  if (installed) {
    return (
      <div className="install-card">
        <strong>已按 App 方式打开</strong>
        <p>当前页面已经具备主屏幕应用体验，可以从底部 Tab 快速切换今日、健康、家属和我的。</p>
      </div>
    );
  }

  return (
    <div className={compact ? 'install-card install-card--compact' : 'install-card'}>
      <strong>添加到主屏幕</strong>
      <p>把 Silver Health 添加到手机主屏幕后，可以像 App 一样从桌面打开。</p>
      {installEvent ? (
        <button type="button" className="touch-button primary-button" onClick={install}>
          安装到手机
        </button>
      ) : (
        <p className="install-card__hint">如果没有出现安装按钮，请用浏览器菜单里的“添加到主屏幕”。</p>
      )}
    </div>
  );
}
