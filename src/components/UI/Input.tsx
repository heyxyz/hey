import { SearchIcon } from '@heroicons/react/outline'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import {
  ComponentProps,
  FocusEvent,
  forwardRef,
  ReactNode,
  useId,
  useState
} from 'react'

import { FieldError } from './Form'

const HelpTooltip = dynamic(() => import('./HelpTooltip'))

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  prefix?: string | ReactNode
  className?: string
  helper?: ReactNode
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, prefix, type = 'text', error, className = '', helper, ...props },
  ref
) {
  const id = useId()
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true)
    props.onFocus?.(event)
  }
  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    props.onBlur?.(event)
  }

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 rounded-l-xl border border-r-0 border-gray-300 dark:bg-gray-900 roun xl dark:border-gray-700/80">
            {prefix}
          </span>
        )}
        <div
          className={clsx(
            { '!border-red-500': error },
            { 'rounded-r-xl': prefix },
            { 'rounded-xl': !prefix },
            { 'ring-1 border-brand-500 ring-brand-400': isFocused },
            {
              'opacity-60 bg-gray-500 bg-opacity-20': props.disabled
            },
            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700/80 outline-none w-full flex items-center',
            className
          )}
        >
          <input
            {...props}
            id={id}
            className={clsx(
              'w-full bg-transparent appearance-none focus:border-none focus:ring-0 border-none p-0 text-[length:inherit]',
              { 'placeholder-red-500': error }
            )}
            type={type}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {type === 'search' && (
            <SearchIcon
              className={clsx(
                'w-6 h-6 mr-2 text-gray-300 dark:text-gray-700/80',
                { '!text-brand-500': isFocused }
              )}
            />
          )}
        </div>
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  )
})
