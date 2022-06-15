import { LensPeriphery } from '@abis/LensPeriphery'
import { gql, useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import IndexStatus from '@components/Shared/IndexStatus'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import { Toggle } from '@components/UI/Toggle'
import AppContext from '@components/utils/AppContext'
import {
  CreateSetProfileMetadataUriBroadcastItemResult,
  MediaSet,
  Profile
} from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { PencilIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import generateSnowflake from '@lib/generateSnowflake'
import getAttribute from '@lib/getAttribute'
import hasPrideLogo from '@lib/hasPrideLogo'
import imagekitURL from '@lib/imagekitURL'
import isBeta from '@lib/isBeta'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import uploadToIPFS from '@lib/uploadToIPFS'
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  APP_NAME,
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENS_PERIPHERY,
  RELAY_ON,
  WRONG_NETWORK
} from 'src/constants'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, optional, string } from 'zod'

const CREATE_SET_PROFILE_METADATA_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileMetadataTypedData(
    $request: CreatePublicSetProfileMetadataURIRequest!
  ) {
    createSetProfileMetadataTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetProfileMetadataURIWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          metadata
        }
      }
    }
  }
`

const editProfileSchema = object({
  name: string()
    .min(2, { message: 'Name should have atleast 2 characters' })
    .max(100, { message: 'Name should not exceed 100 characters' }),
  location: string()
    .max(100, { message: 'Location should not exceed 100 characters' })
    .nullable(),
  website: optional(
    string().max(100, { message: 'Website should not exceed 100 characters' })
  ),
  twitter: string()
    .max(100, { message: 'Twitter should not exceed 100 characters' })
    .nullable(),
  bio: string()
    .max(260, { message: 'Bio should not exceed 260 characters' })
    .nullable()
})

interface Props {
  profile: Profile & { coverPicture: MediaSet }
}

const Profile: FC<Props> = ({ profile }) => {
  const [beta, setBeta] = useState<boolean>(isBeta(profile))
  const [pride, setPride] = useState<boolean>(hasPrideLogo(profile))
  const [cover, setCover] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser, userSigNonce, setUserSigNonce } = useContext(AppContext)
  const { activeChain } = useNetwork()
  const { data: account } = useAccount()
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    toast.success('Profile updated successfully!')
  }

  const {
    data: writeData,
    isLoading: writeLoading,
    error,
    write
  } = useContractWrite(
    {
      addressOrName: LENS_PERIPHERY,
      contractInterface: LensPeriphery
    },
    'setProfileMetadataURIWithSig',
    {
      onSuccess() {
        onCompleted()
      },
      onError(error: any) {
        toast.error(error?.data?.message ?? error?.message)
      }
    }
  )

  const [broadcast, { data: broadcastData, loading: broadcastLoading }] =
    useMutation(BROADCAST_MUTATION, {
      onCompleted({ broadcast }) {
        if (broadcast?.reason !== 'NOT_ALLOWED') {
          onCompleted()
        }
      },
      onError(error) {
        consoleLog('Relay Error', '#ef4444', error.message)
      }
    })
  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_METADATA_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileMetadataTypedData
      }: {
        createSetProfileMetadataTypedData: CreateSetProfileMetadataUriBroadcastItemResult
      }) {
        consoleLog(
          'Mutation',
          '#4ade80',
          'Generated createSetProfileImageURITypedData'
        )
        const { id, typedData } = createSetProfileMetadataTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          setUserSigNonce(userSigNonce + 1)
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline: typedData.value.deadline }
          const inputStruct = {
            user: currentUser?.ownedBy,
            profileId,
            metadata,
            sig
          }
          if (RELAY_ON) {
            broadcast({ variables: { request: { id, signature } } }).then(
              ({ data: { broadcast }, errors }) => {
                if (errors || broadcast?.reason === 'NOT_ALLOWED') {
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

  useEffect(() => {
    if (profile?.coverPicture?.original?.url)
      setCover(profile?.coverPicture?.original?.url)
  }, [profile])

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      const attachment = await uploadAssetsToIPFS(evt.target.files)
      if (attachment[0]?.item) {
        setCover(attachment[0].item)
      }
    } finally {
      setUploading(false)
    }
  }

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile?.name as string,
      location: getAttribute(profile?.attributes, 'location') as string,
      website: getAttribute(profile?.attributes, 'website') as string,
      twitter: getAttribute(profile?.attributes, 'twitter')?.replace(
        'https://twitter.com/',
        ''
      ) as string,
      bio: profile?.bio as string
    }
  })

  const editProfile = async (
    name: string,
    location: string | null,
    website: string | null | undefined,
    twitter: string | null,
    bio: string | null
  ) => {
    if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (activeChain?.id !== CHAIN_ID) {
      toast.error(WRONG_NETWORK)
    } else {
      setIsUploading(true)
      const { path } = await uploadToIPFS({
        name,
        bio,
        cover_picture: cover ? cover : null,
        attributes: [
          {
            traitType: 'string',
            key: 'location',
            value: location
          },
          {
            traitType: 'string',
            key: 'website',
            value: website
          },
          {
            traitType: 'string',
            key: 'twitter',
            value: twitter
          },
          {
            traitType: 'boolean',
            key: 'isBeta',
            value: beta
          },
          {
            traitType: 'boolean',
            key: 'hasPrideLogo',
            value: pride
          },
          {
            traitType: 'string',
            key: 'app',
            value: APP_NAME
          }
        ],
        version: '1.0.0',
        metadata_id: generateSnowflake(),
        appId: APP_NAME
      }).finally(() => setIsUploading(false))

      createSetProfileMetadataTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: {
            profileId: currentUser?.id,
            metadata: `https://ipfs.infura.io/ipfs/${path}`
          }
        }
      })
    }
  }

  return (
    <Card>
      <CardBody>
        <Form
          form={form}
          className="space-y-4"
          onSubmit={({ name, location, website, twitter, bio }) => {
            editProfile(name, location, website, twitter, bio)
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
            label="Profile Id"
            type="text"
            value={currentUser?.id}
            disabled
          />
          <Input
            label="Name"
            type="text"
            placeholder="Gavin"
            {...form.register('name')}
          />
          <Input
            label="Location"
            type="text"
            placeholder="Miami"
            {...form.register('location')}
          />
          <Input
            label="Website"
            type="text"
            placeholder="https://hooli.com"
            {...form.register('website')}
          />
          <Input
            label="Twitter"
            type="text"
            prefix="https://twitter.com"
            placeholder="gavin"
            {...form.register('twitter')}
          />
          <TextArea
            label="Bio"
            placeholder="Tell us something about you!"
            {...form.register('bio')}
          />
          <div className="space-y-1.5">
            <div className="label">Cover</div>
            <div className="space-y-3">
              {cover && (
                <div>
                  <img
                    className="object-cover w-full h-60 rounded-lg"
                    src={imagekitURL(cover, 'cover')}
                    alt={cover}
                  />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <ChooseFile
                  onChange={(evt: ChangeEvent<HTMLInputElement>) =>
                    handleUpload(evt)
                  }
                />
                {uploading && <Spinner size="sm" />}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="label">Beta</div>
            <div className="flex items-center space-x-2">
              <Toggle on={beta} setOn={setBeta} />
              <div>Enroll to {APP_NAME} Beta</div>
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <div className="flex items-center space-x-2 label">
              <img className="w-5 h-5" src="/pride.svg" alt="Pride Logo" />
              <span>Celebrate pride every day</span>
            </div>
            <div className="flex items-center space-x-2">
              <Toggle on={pride} setOn={setPride} />
              <div>
                Turn this on to show your pride and turn the {APP_NAME} logo
                rainbow every day.
              </div>
            </div>
          </div>
          {activeChain?.id !== CHAIN_ID ? (
            <SwitchNetwork className="ml-auto" />
          ) : (
            <div className="flex flex-col space-y-2">
              <Button
                className="ml-auto"
                type="submit"
                disabled={
                  isUploading ||
                  typedDataLoading ||
                  signLoading ||
                  writeLoading ||
                  broadcastLoading
                }
                icon={
                  isUploading ||
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
      </CardBody>
    </Card>
  )
}

export default Profile
