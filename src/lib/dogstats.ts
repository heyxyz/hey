import { datadogLogs } from '@datadog/browser-logs'
import { DOGSTATS_ENABLED } from 'src/constants'

export const Dogstats = {
  track: (name: string, props?: { result?: string }) => {
    console.log(name, props)
    if (DOGSTATS_ENABLED) datadogLogs.logger.info(name, props)
  }
}
