import React, { useState } from 'react'

interface Props {
  children: React.ReactNode
  content: string
}

export const Tooltip: React.FC<Props> = ({ children, content }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  return (
    <div
      onMouseLeave={() => setExpanded(false)}
      onMouseEnter={() => setExpanded(true)}
      className="relative"
    >
      <>{children}</>
      {expanded ? (
        <div
          style={{
            transform: 'translate(-50%, -100%)'
          }}
          className="flex absolute -top-3 left-1/2 z-50 flex-col py-0.5 px-2 mt-2 text-xs font-bold text-gray-100 whitespace-nowrap bg-gray-900 rounded-lg border border-gray-800 truncated"
        >
          {content}
        </div>
      ) : null}
    </div>
  )
}
