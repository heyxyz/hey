import mixpanel, { Dict } from 'mixpanel-browser'
import { MIXPANEL_TOKEN } from 'src/constants'

const enabled = MIXPANEL_TOKEN && true

export const Mixpanel = {
  identify: (id: string) => {
    if (enabled) mixpanel.identify(id)
  },
  track: (name: string, props?: Dict) => {
    if (enabled) mixpanel.track(name, props)
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props)
    }
  }
}
