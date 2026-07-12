"use client";

import { useEffect, useRef } from 'react';

interface TurnstileProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
}

export default function Turnstile({ siteKey, onSuccess, onExpire, onError }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let checkInterval: NodeJS.Timeout;

    const renderWidget = () => {
      const turnstile = (window as any).turnstile;
      if (turnstile && containerRef.current && !widgetIdRef.current) {
        try {
          const id = turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              if (isMounted) onSuccess(token);
            },
            'expired-callback': () => {
              if (isMounted && onExpire) onExpire();
            },
            'error-callback': () => {
              if (isMounted && onError) onError();
            },
          });
          widgetIdRef.current = id;
          if (checkInterval) clearInterval(checkInterval);
        } catch (e) {
          console.error("Turnstile render error:", e);
        }
      }
    };

    // Load Turnstile script if not already present
    if (!document.getElementById('cloudflare-turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    if ((window as any).turnstile) {
      renderWidget();
    } else {
      checkInterval = setInterval(() => {
        if ((window as any).turnstile) {
          renderWidget();
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      isMounted = false;
      if (checkInterval) clearInterval(checkInterval);
      const turnstile = (window as any).turnstile;
      if (widgetIdRef.current && turnstile) {
        try {
          turnstile.remove(widgetIdRef.current);
        } catch (e) {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onSuccess, onExpire, onError]);

  return <div ref={containerRef} className="flex justify-center my-2" />;
}
