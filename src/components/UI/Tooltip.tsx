import Tippy from '@tippyjs/react'
import React, { FC, ReactNode } from 'react'
import { Placement } from 'tippy.js'

interface Props {
  children: ReactNode
  content: string
  placement?: Placement
}

export const Tooltip: FC<Props> = ({
  children,
  content,
  placement = 'right'
}) => {
  return (
    <Tippy
      placement={placement}
      duration={0}
      content={
        <span className="hidden sm:block px-2 py-1 text-[11px] text-white bg-gray-700 border border-gray-900 rounded-lg">
          {content}
        </span>
      }
    >
      <span>{children}</span>
    </Tippy>
  )
}
