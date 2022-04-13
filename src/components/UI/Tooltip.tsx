import Tippy from '@tippyjs/react'
import clsx from 'clsx'
import React, { FC, ReactNode } from 'react'
import { Placement } from 'tippy.js'

interface Props {
  children: ReactNode
  content: string
  placement?: Placement
  className?: string
  withDelay?: boolean
}

export const Tooltip: FC<Props> = ({
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
      className="hidden sm:block"
      content={
        <span
          className={clsx(
            'font-bold tracking-[0.2px] px-2 py-1 text-[11px] text-white bg-gray-700 border border-gray-900 rounded-lg',
            className
          )}
        >
          {content}
        </span>
      }
    >
      <span>{children}</span>
    </Tippy>
  )
}
