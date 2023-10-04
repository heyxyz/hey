import type { FC } from 'react';
import { useEffectOnce } from 'usehooks-ts';

const SW: FC = () => {
  useEffectOnce(() => {
    if ('serviceWorker' in navigator) {
      (navigator.serviceWorker as ServiceWorkerContainer)
        .register('/sw.js', { scope: '/' })
        .catch(console.error);
    }
  });

  return null;
};

export default SW;
