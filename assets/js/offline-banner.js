// offline-banner.js - Banner persistente de modo offline para todas as páginas
(function() {
  const bannerTranslations = {
    pt: { text: 'Modo Offline — Orientações locais limitadas. Conecte-se para análise completa.', restored: 'Conexão restabelecida!' },
    en: { text: 'Offline Mode — Limited local guidance. Connect for full analysis.', restored: 'Connection restored!' },
    es: { text: 'Modo Sin Conexión — Orientaciones locales limitadas. Conéctese para análisis completo.', restored: '¡Conexión restablecida!' }
  };

  function getLang() {
    return document.documentElement.getAttribute('data-current-lang')
      || document.documentElement.lang?.substring(0, 2)
      || localStorage.getItem('preferredLang')
      || localStorage.getItem('appLang')
      || 'pt';
  }

  function createBanner() {
    if (document.getElementById('offline-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'offline-banner';
    banner.style.cssText = 'display:none;position:fixed;top:0;left:0;right:0;z-index:9999;padding:8px 16px;background:#f59e0b;color:#78350f;text-align:center;font-size:14px;font-weight:600;font-family:Lexend,sans-serif;box-shadow:0 2px 4px rgba(0,0,0,0.15);transition:transform 0.3s ease;';

    const icon = document.createElement('span');
    icon.style.marginRight = '8px';
    icon.textContent = '\u26A0';

    const text = document.createElement('span');
    text.id = 'offline-banner-text';

    banner.appendChild(icon);
    banner.appendChild(text);
    document.body.prepend(banner);

    return banner;
  }

  function updateBanner() {
    const banner = document.getElementById('offline-banner') || createBanner();
    const textEl = document.getElementById('offline-banner-text');
    const lang = getLang();
    const t = bannerTranslations[lang] || bannerTranslations.pt;

    if (!navigator.onLine) {
      banner.style.display = 'block';
      banner.style.background = '#f59e0b';
      banner.style.color = '#78350f';
      textEl.textContent = t.text;
      // Push page content down
      document.body.style.paddingTop = (banner.offsetHeight) + 'px';
    } else {
      if (banner.style.display === 'block') {
        // Show "restored" briefly
        banner.style.background = '#10b981';
        banner.style.color = '#fff';
        textEl.textContent = t.restored;
        setTimeout(() => {
          banner.style.display = 'none';
          document.body.style.paddingTop = '';
        }, 3000);
      }
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { createBanner(); updateBanner(); });
  } else {
    createBanner();
    updateBanner();
  }

  window.addEventListener('online', updateBanner);
  window.addEventListener('offline', updateBanner);
})();
