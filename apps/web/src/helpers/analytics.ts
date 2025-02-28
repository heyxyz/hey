/**
 * Track an event with Simple Analytics
 * @param event - The event to track
 * @param data - The data to track
 * @returns The result of the Simple Analytics event
 */
const trackEvent = (event: string, data: any) => {
  return (window as any)?.sa_event(event, data);
};

export default trackEvent;
