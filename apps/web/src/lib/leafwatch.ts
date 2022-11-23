const isBrowser = typeof window !== 'undefined';

/**
 * Leafwatch analytics
 */
export const Leafwatch = {
  track: (name: string) => {
    if (isBrowser) {
      try {
        // @ts-ignore
        window?.sa_event?.(name);
      } catch {
        console.error('Error while sending analytics event to Leafwatch');
      }
    }
  }
};
