(() => {
  const STORAGE_KEY = 'download-banner-dismissed';
  const banner = document.getElementById('download-banner');
  const heroCta = document.querySelector('.hero-cta');
  const downloadSection = document.getElementById('download');
  const closeButton = banner?.querySelector('.download-banner-close');

  if (!banner || !heroCta || !downloadSection || !closeButton || !('IntersectionObserver' in window)) return;

  // Stylesheet missing or stale: keep the banner hidden instead of rendering it unstyled in the page flow.
  if (getComputedStyle(banner).position !== 'fixed') return;

  const readDismissed = () => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  };

  const writeDismissed = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* storage unavailable: dismissal lasts until reload */
    }
  };

  const state = { pastHero: false, atDownload: false, dismissed: readDismissed() };

  const render = () => {
    const visible = state.pastHero && !state.atDownload && !state.dismissed;
    banner.classList.toggle('is-visible', visible);
    banner.inert = !visible;
  };

  const watch = (target, update) => {
    new IntersectionObserver((entries) => {
      update(entries[entries.length - 1]);
      render();
    }).observe(target);
  };

  watch(heroCta, (entry) => {
    state.pastHero = !entry.isIntersecting && entry.boundingClientRect.top < 0;
  });

  watch(downloadSection, (entry) => {
    state.atDownload = entry.isIntersecting || entry.boundingClientRect.top < 0;
  });

  closeButton.addEventListener('click', () => {
    state.dismissed = true;
    writeDismissed();
    render();
  });
})();
