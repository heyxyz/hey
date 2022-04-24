/**
 * A component which is essentially a button to connect to metamasl
 */
//import './index.scss'
import { Button } from '@components/UI/Button'
import { useWeb3React } from '@web3-react/core'
import React from 'react'
import { toast } from 'react-toastify'

import { injected } from '../../web3/connectors'
import { useEagerConnect, useInactiveListener } from '../../web3/hooks'

const Connect = () => {
  const { connector, activate, active, error, account, deactivate } =
    useWeb3React()
  const walletButtomClass = active ? '--active' : ''

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])
  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  React.useEffect(() => {
    if (!error) return
    let message
    if (error.name === 'UnsupportedChainIdError') {
      message = 'Unsupported network, please connect to Ropsten network'
    } else {
      message = error.message
    }
    toast.error(message, {
      position: 'top-left'
    })
  }, [error])

  const connectWalletPressed = () => {
    setActivatingConnector(injected)
    activate(injected)
  }

  return (
    <div className="metamask__window">
      <Button
        type="submit"
        id="walletButton"
        className={walletButtomClass}
        onClick={() => (active ? deactivate() : connectWalletPressed())}
      >
        {active && account.length > 0
          ? account.slice(0, 4) + '......' + account.slice(38)
          : 'Connect Wallet'}
      </Button>
    </div>
  )
}

import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'

function getLibrary(provider, connector) {
  return new Web3Provider(provider)
}

const ConnectWrapped = () => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Connect />
    </Web3ReactProvider>
  )
}

export default ConnectWrapped
