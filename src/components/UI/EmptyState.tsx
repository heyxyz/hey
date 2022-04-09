import React from 'react'

import { Card } from './Card'

interface Props {
  message: React.ReactNode
  icon: React.ReactNode
  hideCard?: boolean
}

export const EmptyState: React.FC<Props> = ({
  message,
  icon,
  hideCard = false
}) => {
  return (
    <Card className={hideCard ? 'border-0 !shadow-none !bg-transparent' : ''}>
      <div className="grid justify-items-center p-5 space-y-2">
        <div>{icon}</div>
        <div>{message}</div>
      </div>
    </Card>
  )
}
