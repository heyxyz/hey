import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import UserProfile from '@components/Shared/UserProfile'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import SEO from '@components/utils/SEO'
import { CreateBurnProfileBroadcastItemResult } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { TrashIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import React, { FC, useContext } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  RELAY_ON,
  WRONG_NETWORK
} from 'src/constants'
import Custom404 from 'src/pages/404'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'

import Sidebar from '../Sidebar'

const CREATE_BURN_PROFILE_TYPED_DATA_MUTATION = gql`
  mutation CreateBurnProfileTypedData($request: BurnProfileRequest!) {
    createBurnProfileTypedData(request: $request) {
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
          BurnWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          tokenId
        }
      }
    }
  }
`

const DeleteSettings: FC = () => {
  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { isLoading: writeLoading, write } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'burnWithSig',
    {
      onSuccess() {
        trackEvent('delete profile')
        localStorage.setItem('selectedProfile', '0')
        location.href = '/'
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )
  const [createBurnProfileTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_BURN_PROFILE_TYPED_DATA_MUTATION, {
      onCompleted({
        createBurnProfileTypedData
      }: {
        createBurnProfileTypedData: CreateBurnProfileBroadcastItemResult
      }) {
        consoleLog(
          'Mutation',
          '#4ade80',
          'Generated createBurnProfileTypedData'
        )
        const { id, typedData } = createBurnProfileTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { tokenId } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } })
          } else {
            write({ args: [tokenId, sig] })
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const handleDelete = () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      createBurnProfileTypedData({
        variables: { request: { profileId: currentUser?.id } }
      })
    }
  }

  if (!currentUser) return <Custom404 />

  return (
    <GridLayout>
      <SEO title="Delete Profile • Lenster" />
      <GridItemFour>
        <Sidebar />
      </GridItemFour>
      <GridItemEight>
        <Card>
          <CardBody className="space-y-5">
            <UserProfile profile={currentUser} />
            <div className="text-lg font-bold text-red-500">
              This will deactivate your account
            </div>
            <p>
              Deleting your account is permanent. All your data will be wiped
              out immediately and you won&rsquo;t be able to get it back.
            </p>
            <div className="text-lg font-bold">What else you should know</div>
            <div className="text-sm text-gray-500 divide-y dark:divide-gray-700">
              <p className="pb-3">
                You cannot restore your Lenster account if it was accidentally
                or wrongfully deleted.
              </p>
              <p className="py-3">
                Some account information may still be available in search
                engines, such as Google or Bing.
              </p>
              <p className="py-3">
                Your @handle will be released immediately after deleting the
                account.
              </p>
            </div>
            <Button
              variant="danger"
              icon={
                typedDataLoading ||
                signLoading ||
                writeLoading ||
                broadcastLoading ? (
                  <Spinner variant="danger" size="xs" />
                ) : (
                  <TrashIcon className="w-5 h-5" />
                )
              }
              onClick={handleDelete}
            >
              {typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading
                ? 'Deleting...'
                : 'Delete your account'}
            </Button>
          </CardBody>
        </Card>
      </GridItemEight>
    </GridLayout>
  )
}

export default DeleteSettings
