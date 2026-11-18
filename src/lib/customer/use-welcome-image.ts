import { useEffect, useState } from 'react';
import { customerApiBaseUrl } from './customer-api';

const loginHero = require('../../../assets/brand/volte-mobile-login-hero.png');

export function useWelcomeImage() {
  const [heroUrl, setHeroUrl] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
      setHeroUrl(null);
    }, 5000);

    async function loadWelcomeImage() {
      try {
        const response = await fetch(`${customerApiBaseUrl()}/api/public/app-sign-in-image`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error();
        const data = await response.json();
        if (!controller.signal.aborted) {
          setHeroUrl(typeof data.imageUrl === 'string' && data.imageUrl.startsWith('https://')
            ? data.imageUrl
            : null);
        }
      } catch {
        if (!controller.signal.aborted) setHeroUrl(null);
      } finally {
        clearTimeout(timeout);
      }
    }

    void loadWelcomeImage();
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  return {
    source: heroUrl === null ? loginHero : heroUrl ? { uri: heroUrl } : undefined,
    onError: () => setHeroUrl(null),
  };
}
