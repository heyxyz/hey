import React from 'react'

interface Props {
  children: React.ReactNode
  className?: string
}

export const SuccessMessage: React.FC<Props> = ({
  children,
  className = ''
}) => {
  return (
    <div
      className={`bg-brand-50 dark:bg-brand-900 dark:bg-opacity-10 border-2 border-brand-500 border-opacity-50 p-4 ${className}`}
    >
      <div className="text-sm text-brand-700 dark:text-brand-200">
        {children}
      </div>
    </div>
  )
}
