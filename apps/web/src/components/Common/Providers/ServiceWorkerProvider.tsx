import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
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
