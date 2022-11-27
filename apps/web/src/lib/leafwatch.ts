const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string) => {
    if (isBrowser) {
      try {
        (window as any)?.sa_event?.(name);
      } catch {
        console.error('Error while sending analytics event to Leafwatch');
      }
    }
  }
};
