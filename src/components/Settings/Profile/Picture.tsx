import LensHubProxy from '@abis/LensHubProxy.json'
import { useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import {
  CreateSetProfileImageUriBroadcastItemResult,
  Profile
} from '@generated/types'
import { PencilIcon } from '@heroicons/react/outline'
import { omit } from '@lib/omit'
import { splitSignature } from '@lib/splitSignature'
import { trackEvent } from '@lib/trackEvent'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import gql from 'graphql-tag'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import {
  chain,
  useAccount,
  useContractWrite,
  useNetwork,
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

interface Props {
  profile: Profile
}

const Picture: React.FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const [{ data: network }] = useNetwork()
  const [{ data: account }] = useAccount()
  const [{ loading: signLoading }, signTypedData] = useSignTypedData()
  const [{ error, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setProfileImageURIWithSig'
  )

  useEffect(() => {
    // @ts-ignore
    if (profile?.picture?.original?.url)
      // @ts-ignore
      setAvatar(profile?.picture?.original?.url)
  }, [profile])

  const [createSetProfileImageURITypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileImageURITypedData
      }: {
        createSetProfileImageURITypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        const { typedData } = createSetProfileImageURITypedData

        signTypedData({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((res) => {
          if (!res.error) {
            const { profileId, imageURI } = typedData?.value
            const { v, r, s } = splitSignature(res.data)
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

            write({ args: inputStruct }).then(({ error }) => {
              if (!error) {
                toast.success('Avatar updated successfully!')
                trackEvent('update avatar')
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

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setAvatar(attachment.item)
    } finally {
      setUploading(false)
    }
  }

  const editProfile = async (avatar: string | undefined) => {
    if (!avatar) {
      toast.error("Avatar can't be empty!")
    } else if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== chain.polygonTestnetMumbai.id) {
      toast.error(WRONG_NETWORK)
    } else {
      createSetProfileImageURITypedData({
        variables: {
          request: {
            profileId: currentUser?.id,
            url: avatar
          }
        }
      })
    }
  }

  return (
    <Card className="space-y-5">
      <CardBody className="space-y-4">
        {error && (
          <ErrorMessage
            className="mb-3"
            title="Transaction failed!"
            error={error}
          />
        )}
        <div className="space-y-1.5">
          <label className="mb-1 font-medium text-gray-800 dark:text-gray-200">
            Avatar
          </label>
          <div className="space-y-3">
            {avatar && (
              <div>
                <img
                  className="w-60 h-60 rounded-lg"
                  src={avatar}
                  alt={avatar}
                />
              </div>
            )}
            <div className="flex items-center space-x-3">
              <ChooseFile
                onChange={(evt: React.ChangeEvent<HTMLInputElement>) =>
                  handleUpload(evt)
                }
              />
              {uploading && <Spinner size="sm" />}
            </div>
          </div>
        </div>
        {network.chain?.unsupported ? (
          <SwitchNetwork className="ml-auto" />
        ) : (
          <Button
            className="ml-auto"
            type="submit"
            disabled={typedDataLoading || signLoading || writeLoading}
            onClick={() => editProfile(avatar)}
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

export default Picture
