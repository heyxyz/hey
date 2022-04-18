import { Switch } from '@headlessui/react'
import clsx from 'clsx'
import { Dispatch, FC } from 'react'

interface Props {
  on: boolean
  setOn: Dispatch<boolean>
}

export const Toggle: FC<Props> = ({ on, setOn }) => {
  return (
    <Switch
      checked={on}
      onChange={setOn}
      className={clsx(
        on ? 'bg-brand-500' : 'bg-gray-200',
        'inline-flex h-[24px] w-[60px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none'
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          on ? 'translate-x-9' : 'translate-x-0',
          'pointer-events-none inline-block h-[20px] w-[20px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200'
        )}
      />
    </Switch>
  )
}
