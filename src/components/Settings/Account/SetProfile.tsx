import LensHubProxy from '@abis/LensHubProxy.json'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { PencilIcon } from '@heroicons/react/outline'
import { trackEvent } from '@lib/trackEvent'
import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

const SetProfile: React.FC = () => {
  const { currentUser, profiles } = useContext(AppContext)
  const [selectedUser, setSelectedUser] = useState<string>()
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ error, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setDefaultProfile'
  )

  const setDefaultProfile = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      write({ args: [selectedUser] }).then(({ error }) => {
        if (!error) {
          toast.success('Default profile updated successfully!')
          trackEvent('update default profile')
        } else {
          toast.error(error?.message)
        }
      })
    }
  }

  const sortedProfiles = profiles?.sort((a, b) =>
    !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
  )

  return (
    <Card>
      <CardBody className="space-y-4">
        {error && <ErrorMessage title="Transaction failed!" error={error} />}
        <div>
          <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            Select default profile
          </div>
          <select
            className="w-full bg-white rounded-xl border border-gray-300 outline-none dark:bg-gray-800 dark:border-gray-700 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {sortedProfiles?.map((profile: Profile) => (
              <option key={profile.id} value={profile.id}>
                @{profile.handle}
              </option>
            ))}
          </select>
        </div>
        {network.chain?.unsupported ? (
          <SwitchNetwork className="ml-auto" />
        ) : (
          <Button
            className="ml-auto"
            type="submit"
            disabled={writeLoading}
            onClick={setDefaultProfile}
            icon={
              writeLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="w-4 h-4" />
              )
            }
          >
            Save
          </Button>
        )}
      </CardBody>
    </Card>
  )
}

export default SetProfile
