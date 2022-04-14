import { IS_PRODUCTION } from 'src/constants'

import consoleLog from './consoleLog'

const trackEvent = (event: string, type: string | null = 'click') => {
  if (!event) return
  if (!IS_PRODUCTION) return

  consoleLog('TrackEvent', '#22c55e', event)
  // @ts-ignore
  return window?.gtag('event', type, {
    event_label: event
  })
}

export default trackEvent
