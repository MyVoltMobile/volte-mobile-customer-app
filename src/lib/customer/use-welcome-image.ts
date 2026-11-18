import { useEffect, useState } from 'react';
import { customerApiBaseUrl } from './customer-api';

const loginHero = require('../../../assets/brand/volte-mobile-login-hero.png');

export function useWelcomeImage() {
  const [heroUrl, setHeroUrl] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWelcomeImage() {
      try {
        const response = await fetch(`${customerApiBaseUrl()}/api/public/app-sign-in-image`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        const data = await response.json();
        if (!controller.signal.aborted && typeof data.imageUrl === 'string' && data.imageUrl.startsWith('https://')) {
          setHeroUrl(data.imageUrl);
        }
      } catch {
        // Keep the bundled welcome image when the ERP is unavailable.
      }
    }

    void loadWelcomeImage();
    return () => controller.abort();
  }, []);

  return {
    source: heroUrl ? { uri: heroUrl } : loginHero,
    onError: () => setHeroUrl(null),
  };
}
