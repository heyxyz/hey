import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Profile, SetDefaultProfileBroadcastItemResult } from '@generated/types'
import { PencilIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { trackEvent } from '@lib/trackEvent'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
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

const SetProfile: React.FC = () => {
  const { profiles } = useContext(AppContext)
  const [selectedUser, setSelectedUser] = useState<string>()
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ error, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setDefaultProfileWithSig'
  )

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
        const { typedData } = createSetDefaultProfileTypedData
        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { wallet, profileId } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
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

            write({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                toast.success('Default profile updated successfully!')
                trackEvent('set default profile')
              } else {
                toast.error(error?.message)
              }
            })
          } else {
            toast.error(res.error?.message)
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const setDefaultProfile = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createSetDefaultProfileTypedData({
        variables: {
          request: { profileId: selectedUser }
        }
      })
    }
  }

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
