import React from 'react'

const ViaLenster: React.FC = () => {
  return (
    <div className="flex items-center py-3 px-5 space-x-2 text-gray-500 border-t dark:border-t-gray-800">
      <img src="/logo.svg" className="w-5 h-5" alt="Logo" />
      <div>Posted via Lenster</div>
    </div>
  )
}

export default ViaLenster
