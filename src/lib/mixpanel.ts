import mixpanel from 'mixpanel-browser'

const enabled = true

const actions = {
  identify: (id?: string) => {
    if (enabled) mixpanel.identify(id)
  },
  alias: (id: string) => {
    if (enabled) mixpanel.alias(id)
  },
  track: (name: string, props?: {}) => {
    if (enabled) mixpanel.track(name, props)
  },
  people: {
    set: (props: {}) => {
      if (enabled) mixpanel.people.set(props)
    }
  }
}

export let Mixpanel = actions
