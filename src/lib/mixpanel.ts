import mixpanel, { Dict } from 'mixpanel-browser'
import { IS_PRODUCTION, MIXPANEL_TOKEN } from 'src/constants'

const enabled = MIXPANEL_TOKEN && IS_PRODUCTION

export const Mixpanel = {
  identify: (id: string) => {
    if (enabled) mixpanel.identify(id)
  },
  track: (name: string, props?: Dict & { result?: string }) => {
    if (enabled) mixpanel.track(name, props)
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props)
    }
  }
}
