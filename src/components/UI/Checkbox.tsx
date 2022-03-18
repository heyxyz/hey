import clsx from 'clsx'
import { ComponentProps, forwardRef } from 'react'

interface Props extends ComponentProps<'input'> {
  className?: string
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Input(
  { className = '', ...props },
  ref
) {
  return (
    <input
      className={clsx('text-brand-500 p-2', className)}
      type="checkbox"
      ref={ref}
      {...props}
    />
  )
})
