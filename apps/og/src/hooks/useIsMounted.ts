import { useEffect, useState } from 'react';

export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  return isMounted;
};
