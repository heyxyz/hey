import LensHubProxy from '@abis/LensHubProxy.json'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Button } from '@components/UI/Button'
import AppContext from '@components/utils/AppContext'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  Profile
} from '@generated/types'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import gql from 'graphql-tag'
import React, { FC, useContext, useState } from 'react'
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
  useSignMessage,
  useSignTypedData
} from 'wagmi'

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
  profile: Profile
}

const NFTPicture: FC<Props> = ({ profile }) => {
  const { currentUser } = useContext(AppContext)
  const [challengeId, setChallengeId] = useState<string>('')
  const { data: network, activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })
  const { signMessageAsync } = useSignMessage()
  const {
    error,
    isLoading: writeLoading,
    write
  } = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setProfileImageURIWithSig',
    {
      onSuccess() {
        toast.success('Avatar updated successfully!')
        trackEvent('update avatar')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )
  const [loadChallenge, { error: errorChallenege }] =
    useLazyQuery(CHALLENGE_QUERY)

  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        const { typedData } = createSetProfileImageURITypedData

        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, imageURI } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            profileId,
            imageURI,
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

  const setAvatar = async () => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      const challengeRes = await loadChallenge({
        variables: {
          request: {
            ethereumAddress: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
            nfts: {
              contractAddress: '0x277f5959e22f94d5bd4c2cc0a77c4c71f31da3ac',
              tokenId: '1',
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
    <div className="space-y-1.5">
      <Button onClick={setAvatar}>Set NFT Avatar</Button>
    </div>
  )
}

export default NFTPicture
