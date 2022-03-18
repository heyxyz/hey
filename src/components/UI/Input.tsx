import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

import { FieldError } from './Form'

interface Props extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string
  prefix?: string | React.ReactNode
  className?: string
  error?: boolean
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, prefix, type = 'text', error, className = '', ...props },
  ref
) {
  return (
    <label className="w-full">
      {label && (
        <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
          {label}
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 roun xl dark:bg-gray-900 dark:border-gray-700 rounded-l-xl">
            {prefix}
          </span>
        )}
        <input
          className={clsx(
            { '!border-red-500 placeholder-red-500': error },
            { 'rounded-r-xl': prefix },
            { 'rounded-xl': !prefix },
            'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:border-brand-500 focus:ring-brand-400 disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 outline-none w-full',
            className
          )}
          type={type}
          ref={ref}
          {...props}
        />
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  )
})
