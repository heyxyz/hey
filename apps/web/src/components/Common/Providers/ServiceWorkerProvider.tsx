import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Trigger an update
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.update();
        }
      });

      // Register the service worker
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/sw.js', { scope: '/' })
        .catch(console.error);
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
