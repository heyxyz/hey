import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Trigger an update
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
          registration.update().then(() => {
            console.log('ServiceWorker updated successfully!');
          });
        }
      });

      // Register the service worker
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/sw.js', { scope: '/' })
        .then(() => {
          console.log('ServiceWorker registered successfully!');
        })
        .catch(console.error);
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
