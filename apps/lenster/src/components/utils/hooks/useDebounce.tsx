import { DependencyList, EffectCallback, useEffect } from 'react';

export const useDebounce = (effect: EffectCallback, delay: number, deps?: DependencyList): void => {
  useEffect(() => {
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // using || operator because
    // if its optional then it can be undefined.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};
