import { IS_PRODUCTION } from 'src/constants'

import consoleLog from './consoleLog'

const trackEvent = (event: string, type: string | null = 'click') => {
  if (!event || !IS_PRODUCTION || !(window as any)?.umami) return
  consoleLog('TrackEvent', '#22c55e', event)

  return (window as any)?.umami?.trackEvent(event, type)
}

export default trackEvent
