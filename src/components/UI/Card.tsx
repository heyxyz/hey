interface CardProps {
  children: React.ReactNode
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-none sm:rounded-xl ${className}`}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  children: React.ReactNode
  className?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return <div className={`border-b p-3 ${className}`}>{children}</div>
}

interface CardBodyProps {
  children?: React.ReactNode
  className?: string
}
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = ''
}) => {
  return <div className={`p-5 ${className}`}>{children}</div>
}
