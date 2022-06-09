import { Card } from '@components/UI/Card'
import React, { FC } from 'react'

interface Props {
  type?: string
}

const HiddenPost: FC<Props> = ({ type = 'Publication' }) => {
  return (
    <Card className="!bg-gray-100 dark:!bg-gray-800">
      <div className="px-4 py-3 italic text-sm">
        {type} was hidden by the author
      </div>
    </Card>
  )
}

export default HiddenPost
