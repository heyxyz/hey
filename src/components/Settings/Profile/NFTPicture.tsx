import LensHubProxy from '@abis/LensHubProxy.json'
import { useLazyQuery, useMutation } from '@apollo/client'
import IndexStatus from '@components/Shared/IndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  NftImage,
  Profile
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { PencilIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import gql from 'graphql-tag'
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
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignMessage,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

const editNftPictureSchema = object({
  contractAddress: string()
    .max(42, { message: 'Contract address should be within 42 characters' })
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid Contract address' }),
  tokenId: string()
})

const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageUriTypedData(
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(request: $request) {
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
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`

const CHALLENGE_QUERY = gql`
  query Challenge($request: NftOwnershipChallengeRequest!) {
    nftOwnershipChallenge(request: $request) {
      id
      text
    }
  }
`

interface Props {
  profile: Profile & { picture: NftImage }
}

const NFTPicture: FC<Props> = ({ profile }) => {
  const form = useZodForm({
    schema: editNftPictureSchema,
    defaultValues: {
      contractAddress: '0x277f5959e22f94d5bd4c2cc0a77c4c71f31da3ac',
      tokenId: profile?.picture?.tokenId
    }
  })

  const { currentUser } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { signMessageAsync } = useSignMessage()

  const onCompleted = () => {
    toast.success('Avatar updated successfully!')
    trackEvent('update nft avatar')
  }

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setProfileImageURIWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )
  const [loadChallenge, { loading: challengeLoading }] =
    useLazyQuery(CHALLENGE_QUERY)
  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted() {
        onCompleted()
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })
  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        const { id, typedData } = createSetProfileImageURITypedData

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            profileId,
            imageURI,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ errors }) => {
                if (errors) {
                  write({ args: inputStruct })
                }
              }
            )
          } else {
            write({ args: inputStruct })
          }
        })
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    })

  const setAvatar = async (contractAddress: string, tokenId: string) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      const challengeRes = await loadChallenge({
        variables: {
          request: {
            ethereumAddress: currentUser?.ownedBy,
            nfts: {
              contractAddress,
              tokenId,
              chainId: 80001
            }
          }
        }
      })
      signMessageAsync({
        message: challengeRes?.data?.nftOwnershipChallenge?.text
      }).then((signature) => {
        createSetProfileImageURITypedData({
          variables: {
            request: {
              profileId: currentUser?.id,
              nftData: {
                id: challengeRes?.data?.nftOwnershipChallenge?.id,
                signature
              }
            }
          }
        })
      })
    }
  }

  return (
    <Form
      form={form}
      className="space-y-4"
      onSubmit={({ contractAddress, tokenId }) => {
        setAvatar(contractAddress, tokenId)
      }}
    >
      {error && (
        <ErrorMessage
          className="mb-3"
          title="Transaction failed!"
          error={error}
        />
      )}
      <Input
        label="Contract Address"
        type="text"
        placeholder="0x277f5959e22f94d5bd4c2cc0a77c4c71f31da3ac"
        {...form.register('contractAddress')}
      />
      <Input
        label="Token Id"
        type="text"
        placeholder="1"
        {...form.register('tokenId')}
      />
      {activeChain?.id !== CHAIN_ID ? (
        <SwitchNetwork className="ml-auto" />
      ) : (
        <div className="flex flex-col space-y-2">
          <Button
            className="ml-auto"
            type="submit"
            disabled={
              challengeLoading ||
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading
            }
            icon={
              challengeLoading ||
              typedDataLoading ||
              signLoading ||
              writeLoading ||
              broadcastLoading ? (
                <Spinner size="xs" />
              ) : (
                <PencilIcon className="w-4 h-4" />
              )
            }
          >
            Save
          </Button>
          {writeData?.hash ?? broadcastData?.broadcast?.txHash ? (
            <IndexStatus
              txHash={
                writeData?.hash
                  ? writeData?.hash
                  : broadcastData?.broadcast?.txHash
              }
            />
          ) : null}
        </div>
      )}
    </Form>
  )
}

export default NFTPicture
