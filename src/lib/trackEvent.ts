export const trackEvent = (event: string, type: string | null = 'click') => {
  if (!event) return ''

  if (typeof window !== 'undefined') {
    // @ts-ignore
    return window.umami.trackEvent(event, type)
  }
}
