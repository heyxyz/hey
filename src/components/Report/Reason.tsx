import React, { Dispatch } from 'react'

interface Props {
  setReason: Dispatch<string>
  setSubReason: Dispatch<string>
}

const Reason: React.FC<Props> = ({ setReason, setSubReason }) => {
  return (
    <div>
      <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
        WIP
      </div>
    </div>
  )
}

export default Reason
