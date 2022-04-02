export const trackEvent = (event: string | null | undefined) => {
  if (!event) return ''

  if (typeof window !== 'undefined') {
    // @ts-ignore
    return window.umami(event)
  }
}
