import type { FC } from 'react';

import { useEffect } from 'react';

const ServiceWorkerProvider: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/sw.js', { scope: '/' })
        .catch(console.error);
    }
  }, []);

  return null;
};

export default ServiceWorkerProvider;
