import Tippy from '@tippyjs/react/headless'
import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
interface Props {
  children: ReactNode
  content: ReactNode
  placement?: 'top' | 'right'
  className?: string
  withDelay?: boolean
}

export const Popover: FC<Props> = ({
  children,
  content,
  placement = 'right',
  className = '',
  withDelay = false
}) => {
  return (
    <Tippy
      placement={placement}
      duration={0}
      delay={[withDelay ? 500 : 0, 0]}
      render={() => (
        <span
          className={clsx(
            'bg-white border dark:border-gray-700/80 rounded-lg',
            className
          )}
        >
          {content}
        </span>
      )}
    >
      <span>{children}</span>
    </Tippy>
  )
}
