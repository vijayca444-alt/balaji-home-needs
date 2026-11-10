import { useEffect, useState } from 'react';
import './PWAInstallPrompt.css';

export default function PWAInstallPrompt() {
  const [installEvent, setInstallEvent] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem('balaji_pwa_prompt_dismissed') === '1');

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault();
      setInstallEvent(event);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      setShowHelp(false);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone;

  async function install() {
    if (!installEvent) {
      setShowHelp(true);
      return;
    }
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
  }

  if (installed || isStandalone || dismissed || (!installEvent && !isIOS)) return null;

  return (
    <>
      <div className="pwa-install-chip">
        <span className="pwa-install-mark" aria-hidden="true">B</span>
        <span className="pwa-install-copy"><strong>Balaji Home Needs</strong><small>Install our shopping app</small></span>
        <button type="button" onClick={install}>Install</button>
        <button type="button" className="pwa-dismiss" aria-label="Dismiss install prompt" onClick={() => { setDismissed(true); sessionStorage.setItem('balaji_pwa_prompt_dismissed', '1'); }}>×</button>
      </div>
      {showHelp && (
        <div className="pwa-help-backdrop" role="presentation" onClick={() => setShowHelp(false)}>
          <section className="pwa-help-card" role="dialog" aria-modal="true" aria-labelledby="pwa-help-title" onClick={(event) => event.stopPropagation()}>
            <button className="pwa-help-close" type="button" onClick={() => setShowHelp(false)} aria-label="Close">×</button>
            <span className="pwa-install-mark pwa-help-mark">B</span>
            <h2 id="pwa-help-title">Install Balaji Home Needs</h2>
            {isIOS ? (
              <ol><li>Tap the <strong>Share</strong> icon in Safari.</li><li>Scroll and choose <strong>Add to Home Screen</strong>.</li><li>Tap <strong>Add</strong> to finish.</li></ol>
            ) : (
              <ol><li>Open this website in Chrome.</li><li>Tap the browser menu (⋮).</li><li>Choose <strong>Install app</strong> or <strong>Add to Home screen</strong>.</li></ol>
            )}
            <button type="button" className="pwa-help-done" onClick={() => setShowHelp(false)}>Got it</button>
          </section>
        </div>
      )}
    </>
  );
}
