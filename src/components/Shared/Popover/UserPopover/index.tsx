import Tippy from '@tippyjs/react/headless'
import dynamic from 'next/dynamic'
import React from 'react'

const Content = dynamic(() => import('./Content'))

interface Props {
  handle: string
  showPopover: boolean
  children: any
}

const UserPopover: React.FC<Props> = ({ handle, showPopover, children }) => {
  if (!handle) return children

  return (
    <Tippy
      delay={[600, 0]}
      placement="top"
      followCursor={false}
      interactive
      render={() => <Content handle={handle} showPopover={showPopover} />}
    >
      {children}
    </Tippy>
  )
}

export default UserPopover
