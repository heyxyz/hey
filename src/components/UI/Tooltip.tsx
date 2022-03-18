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
      <div>{children}</div>
      {expanded ? (
        <div
          style={{
            transform: 'translate(-50%, -100%)'
          }}
          className="flex absolute -top-3 left-1/2 z-50 flex-col py-0.5 px-2 mt-2 text-xs font-bold text-gray-100 whitespace-nowrap bg-gray-900 border border-gray-800 truncated rounded-lg"
        >
          {content}
        </div>
      ) : null}
    </div>
  )
}
