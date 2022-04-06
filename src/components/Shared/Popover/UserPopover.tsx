import { Card, CardBody } from '@components/UI/Card'
import Tippy from '@tippyjs/react/headless'
import React from 'react'
import { followCursor } from 'tippy.js'

interface Props {
  children: any
}

const UserPopover: React.FC<Props> = ({ children }) => {
  return (
    <Tippy
      placement="top"
      delay={[400, 0]}
      interactive
      followCursor="initial"
      plugins={[followCursor]}
      render={() => (
        <Card>
          <CardBody>Hello</CardBody>
        </Card>
      )}
    >
      {children}
    </Tippy>
  )
}

export default UserPopover
