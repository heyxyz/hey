import React from 'react'
import { STATIC_ASSETS } from 'src/constants'

const Hero: React.FC = () => {
  return (
    <div
      className="text-white bg-brand-500 dark:bg-brand-700 md:block"
      style={{
        backgroundImage: `url('${STATIC_ASSETS}/patterns/2.svg')`
      }}
    >
      <div className="container flex-grow max-w-screen-xl px-5 py-32 mx-auto space-y-5">
        <div className="text-4xl font-extrabold tracking-wide">
          What's poppin'?
        </div>
        <div className="text-xl">
          Lenshub is a composable, decentralized, and permissionless social
          media web app built with Lens Protocol 🌿
        </div>
      </div>
    </div>
  )
}

export default Hero
