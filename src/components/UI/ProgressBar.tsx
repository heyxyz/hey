import React from 'react'

interface Props {
  percentage: number
  className?: string
}

export const ProgressBar: React.FC<Props> = ({
  percentage,
  className = ''
}) => {
  return (
    <div className={`w-full bg-gray-200 h-2.5 ${className}`}>
      <div
        className="h-2.5 bg-brand-500"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}
