import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import UserProfile from '@components/Shared/UserProfile'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Profile, SetDefaultProfileBroadcastItemResult } from '@generated/types'
import { ExclamationIcon, PencilIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import React, { FC, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

const CREATE_SET_DEFAULT_PROFILE_DATA_MUTATION = gql`
  mutation CreateSetDefaultProfileTypedData(
    $request: SetDefaultProfileRequest!
  ) {
    createSetDefaultProfileTypedData(request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          wallet
          profileId
        }
      }
    }
  }
`

const SetProfile: FC = () => {
  const { currentUser, profiles } = useContext(AppContext)
  const [selectedUser, setSelectedUser] = useState<string>()
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const {
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setDefaultProfileWithSig',
    {
      onSuccess() {
        toast.success('Default profile updated successfully!')
        trackEvent('set default profile')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const hasDefaultProfile = !!profiles.find((o) => o.isDefault)
  const sortedProfiles: Profile[] = profiles?.sort((a, b) =>
    !(a.isDefault !== b.isDefault) ? 0 : a.isDefault ? -1 : 1
  )

  useEffect(() => {
    setSelectedUser(sortedProfiles[0]?.id)
  }, [sortedProfiles])

  const [createSetDefaultProfileTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_DEFAULT_PROFILE_DATA_MUTATION, {
      onCompleted({
        createSetDefaultProfileTypedData
      }: {
        createSetDefaultProfileTypedData: SetDefaultProfileBroadcastItemResult
      }) {
        consoleLog(
          'Mutation',
          '#4ade80',
          'Generated createSetDefaultProfileTypedData'
        )
        const { typedData } = createSetDefaultProfileTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { wallet, profileId } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            follower: account?.address,
            wallet,
            profileId,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline
            }
          }
          write({ args: inputStruct })
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const setDefaultProfile = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createSetDefaultProfileTypedData({
        variables: {
          request: { profileId: selectedUser }
        }
      })
    }
  }

  if (!currentUser) return <Custom404 />

  return (
    <Card>
      <CardBody className="space-y-5">
        {error && <ErrorMessage title="Transaction failed!" error={error} />}
        {hasDefaultProfile ? (
          <>
            <div className="text-lg font-bold">Your default profile</div>
            <UserProfile profile={sortedProfiles[0]} />
          </>
        ) : (
          <div className="flex items-center space-x-1.5 font-bold text-yellow-500">
            <ExclamationIcon className="w-5 h-5" />
            <div>You don't have any default profile set!</div>
          </div>
        )}
        <div className="text-lg font-bold">Select default profile</div>
        <p>
          Selecting your default account helps to display the selected profile
          across Lenster, you can change your default profile anytime.
        </p>
        <div className="text-lg font-bold">What else you should know</div>
        <div className="text-sm text-gray-500 divide-y">
          <p className="pb-3">
            Only the default profile will be visible across the Lenster, example
            notifications, follow etc.
          </p>
          <p className="py-3">You can change default profile anytime here.</p>
        </div>
        <div>
          <div className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            Select profile
          </div>
          <select
            className="w-full bg-white border border-gray-300 outline-none rounded-xl dark:bg-gray-800 dark:border-gray-700/80 disabled:bg-gray-500 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            {sortedProfiles?.map((profile: Profile) => (
              <option key={profile.id} value={profile.id}>
                @{profile.handle}
              </option>
            ))}
          </select>
        </div>
        {activeChain?.unsupported ? (
          <SwitchNetwork className="ml-auto" />
        ) : (
          <Button
            className="ml-auto"
            type="submit"
            disabled={typedDataLoading || signLoading || writeLoading}
            onClick={setDefaultProfile}
            icon={
              typedDataLoading || signLoading || writeLoading ? (
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
