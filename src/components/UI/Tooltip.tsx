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
      content={
        <span className="text-xs text-white py-1 px-2 rounded-lg bg-gray-700">
          {content}
        </span>
      }
    >
      <div>{children}</div>
    </Tippy>
  )
}
