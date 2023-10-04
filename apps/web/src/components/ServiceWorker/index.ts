import { FC, useEffect } from 'react';

const ServiceWorker: FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/service-worker.js', { scope: '/' })
        .catch(console.error);
    }
  }, []);

  return null;
};

export default ServiceWorker;
