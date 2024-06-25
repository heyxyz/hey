import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register(
            '/sw.js',
            { scope: '/' }
          );
          console.log('ServiceWorker registered successfully!');

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  console.log(
                    'New ServiceWorker available. Refresh the page to update.'
                  );
                }
              };
            }
          };

          await navigator.serviceWorker.ready;
          if (navigator.serviceWorker.controller) {
            console.log('Service Worker is ready to receive messages.');
          }
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
