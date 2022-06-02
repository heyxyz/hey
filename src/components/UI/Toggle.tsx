import { Switch } from '@headlessui/react'
import trackEvent from '@lib/trackEvent'
import clsx from 'clsx'
import { Dispatch, FC } from 'react'

interface Props {
  name: string
  on: boolean
  setOn: Dispatch<boolean>
}

export const Toggle: FC<Props> = ({ name, on, setOn }) => {
  return (
    <Switch
      checked={on}
      onChange={() => {
        trackEvent(`toggle ${on ? 'on' : 'off'} ${name}`)
        setOn(!on)
      }}
      className={clsx(
        on ? 'bg-brand-500' : 'bg-gray-200',
        'inline-flex h-[22px] w-[42.5px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          on ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}
