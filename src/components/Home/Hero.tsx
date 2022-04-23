import Login from '@components/Shared/Navbar/Login'
import { Button } from '@components/UI/Button'
import { Modal } from '@components/UI/Modal'
import { ArrowCircleRightIcon } from '@heroicons/react/outline'
import trackEvent from '@lib/trackEvent'
import Link from 'next/link'
import React from 'react'
import { FC, Fragment, useState } from 'react'
import { useDisconnect, useNetwork } from 'wagmi'

export const NextLink = ({ href, children, ...rest }: Record<string, any>) => (
  <Link href={href}>
    <a {...rest}>{children}</a>
  </Link>
)

const LoginModal: FC = () => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const { activeChain } = useNetwork()
  const { disconnect } = useDisconnect()
  return (
    <>
      <Modal
        title="Login"
        icon={<ArrowCircleRightIcon className="w-5 h-5 text-brand" />}
        show={showLoginModal}
        onClose={() => setShowLoginModal(!showLoginModal)}
      >
        <Login />
      </Modal>
      <Button
        icon={
          <img
            className="mr-0.5 h-4 "
            src="/eth-white.svg"
            alt="Ethereum Logo"
          />
        }
        onClick={() => {
          trackEvent('login')
          setShowLoginModal(!showLoginModal)
        }}
        className="bg-brand-yellow"
      >
        Connect Wallet
      </Button>
    </>
  )
}

const Hero: FC = () => {
  return (
    <div className="py-12 mb-4 bg-white border-b bg-hero">
      <div className="container px-5 mx-auto max-w-screen-xl">
        <div className="flex items-stretch py-8 w-full text-center sm:py-12 sm:text-left">
          <div className="flex-1 flex-shrink-0 space-y-3">
            <div className="text-2xl font-extrabold text-white sm:text-4xl banner-text">
              Discover new places and activities in the metaverse. Powered by
              your social circle.{' '}
            </div>
            <LoginModal></LoginModal>
          </div>
          <div className="hidden flex-1 flex-shrink-0 w-full sm:block" />
        </div>
      </div>
    </div>
  )
}

export default Hero
