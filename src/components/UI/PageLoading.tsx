import React from 'react'

import { Spinner } from './Spinner'

interface Props {
  message?: string
}

export const PageLoading: React.FC<Props> = ({ message }) => {
  return (
    <div className="flex items-center justify-center flex-grow">
      <div className="space-y-3">
        <Spinner className="mx-auto" />
        <div>{message}</div>
      </div>
    </div>
  )
}
