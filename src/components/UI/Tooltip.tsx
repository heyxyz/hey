import Tippy from '@tippyjs/react'
import React from 'react'
import { Placement } from 'tippy.js'

interface Props {
  children: React.ReactNode
  placement?: Placement
  content: string
}

export const Tooltip: React.FC<Props> = ({
  children,
  placement = 'right',
  content
}) => {
  return (
    <Tippy
      placement={placement}
      duration={0}
      animation="fade"
      content={
        <span className="bg-gray-800 text-white text-xs rounded-lg px-2 py-1">
          {content}
        </span>
      }
    >
      <div>{children}</div>
    </Tippy>
  )
}
