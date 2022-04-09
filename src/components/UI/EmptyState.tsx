import React, { FC, ReactNode } from 'react'

import { Card } from './Card'

interface Props {
  message: ReactNode
  icon: ReactNode
  hideCard?: boolean
}

export const EmptyState: FC<Props> = ({ message, icon, hideCard = false }) => {
  return (
    <Card className={hideCard ? 'border-0 !shadow-none !bg-transparent' : ''}>
      <div className="grid p-5 space-y-2 justify-items-center">
        <div>{icon}</div>
        <div>{message}</div>
      </div>
    </Card>
  )
}
