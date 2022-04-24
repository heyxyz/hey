//import './styles.css'
//let styles = require('./styles.css')
//import ConnectButton from '@components/Connect'
import { GridItemFour, GridLayout } from '@components/GridLayout'
import SettingsHelper from '@components/Shared/SettingsHelper'
import { Button } from '@components/UI/Button'
import SEO from '@components/utils/SEO'
import { channels } from '@epnsproject/frontend-sdk'
import { useWeb3React } from '@web3-react/core'
import React, { FC } from 'react'
import { useEffect, useState } from 'react'

const BASE_URL = 'https://backend-kovan.epns.io/apis'
const CHANNEL_ADDRESS = '0x56693C17Ac666320e951e2fa1adcb228E0Bc03A2'

const NotificationSettings: FC = () => {
  const { library, active, account, chainId } = useWeb3React()
  const [isSubscribed, setIsSubscribed] = useState(false)

  const [channel, setChannel] = useState(null)
  // load channel details on start
  useEffect(() => {
    if (!account) return
    // on page load, fetch channel details
    channels.getChannelByAddress(CHANNEL_ADDRESS).then((data: any) => {
      setChannel(data)
    })
    // fetch if user is subscribed to channel
    channels.isUserSubscribed(account, CHANNEL_ADDRESS).then((res: any) => {
      console.log(res)
      setIsSubscribed(res)
    })
  }, [account])

  return (
    <GridLayout>
      <SEO title="Create Profile • Lenster" />

      <GridItemFour>
        <SettingsHelper
          heading="Please connect your wallet on the kovan test network to proceed"
          description="The button will redirect you to EPNS"
        />
        <Button
          // type="button"
          onClick={(e) => {
            e.preventDefault()
            window.location.href = 'https://staging-app.epns.io/#/channels'
          }}
        >
          Connect Wallet
        </Button>
      </GridItemFour>
    </GridLayout>
  )
}

export default NotificationSettings
