import { IS_PRODUCTION } from 'src/constants'

import consoleLog from './consoleLog'

const trackEvent = (event: string, type: string | null = 'click') => {
  // @ts-ignore
  if (!event || !IS_PRODUCTION || !window?.umami) return

  consoleLog('TrackEvent', '#22c55e', event)
  // @ts-ignore
  return window?.umami?.trackEvent(event, type)
}

export default trackEvent
