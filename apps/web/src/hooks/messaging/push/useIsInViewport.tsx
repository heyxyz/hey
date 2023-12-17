/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

export function useIsInViewport(element: any, rootMargin: any) {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting);
      },
      { rootMargin }
    );

    element.current && observer.observe(element.current);

    return () => observer.disconnect();
  }, []);

  return isVisible;
}
