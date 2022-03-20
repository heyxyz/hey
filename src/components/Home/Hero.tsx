import React from 'react'

const Hero: React.FC = () => {
  return (
    <div className="py-12 mb-4 bg-white border-b bg-hero">
      <div className="container max-w-screen-xl px-5 mx-auto">
        <div className="flex items-stretch w-full py-8 text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-2xl font-extrabold text-black sm:text-4xl">
              Welcome to LensHub 👋
            </div>
            <div className="leading-7 text-gray-700">
              LensHub is a composable, decentralized, and permissionless social
              media web app built with Lens Protocol 🌿
            </div>
          </div>
          <div className="flex-1 flex-shrink-0 hidden w-full sm:block"></div>
        </div>
      </div>
    </div>
  )
}

export default Hero
