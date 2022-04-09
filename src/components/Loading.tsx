import { FC } from 'react'

import SEO from './utils/SEO'

const Loading: FC = () => {
  return (
    <div className="flex items-center justify-center flex-grow h-screen animate-pulse">
      <SEO />
      <img className="w-28 h-28" src="/logo.svg" alt="Logo" />
    </div>
  )
}

export default Loading
