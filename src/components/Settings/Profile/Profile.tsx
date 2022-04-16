import LensHubProxy from '@abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { PencilIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import imagekitURL from '@lib/imagekitURL'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import uploadToIPFS from '@lib/uploadToIPFS'
import React, { ChangeEvent, FC, useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  CHAIN_ID,
  CONNECT_WALLET,
  ERROR_MESSAGE,
  LENSHUB_PROXY,
  WRONG_NETWORK
} from 'src/constants'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useSignTypedData
} from 'wagmi'
import { object, string } from 'zod'

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
  website: string()
    .url({ message: 'Invalid URL' })
    .max(100, { message: 'Website should not exceed 100 characters' })
    .nullable(),
  twitter: string()
    .max(100, { message: 'Twitter should not exceed 100 characters' })
    .nullable(),
  bio: string()
    .max(260, { message: 'Bio should not exceed 260 characters' })
    .nullable()
})

interface Props {
  profile: Profile
}

const Profile: FC<Props> = ({ profile }) => {
  const [cover, setCover] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
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
    'setProfileMetadataURIWithSig',
    {
      onSuccess() {
        toast.success('Avatar updated successfully!')
        trackEvent('update profile')
      },
      onError(error) {
        toast.error(error?.message)
      }
    }
  )

  const [createSetProfileMetadataTypedData, { loading: typedDataLoading }] =
    useMutation(CREATE_SET_PROFILE_METADATA_TYPED_DATA_MUTATION, {
      onCompleted({
        createSetProfileMetadataTypedData
      }: {
        createSetProfileMetadataTypedData: CreateSetProfileImageUriBroadcastItemResult
      }) {
        consoleLog(
          'Mutation',
          '#4ade80',
          'Generated createSetProfileImageURITypedData'
        )
        const { typedData } = createSetProfileMetadataTypedData
        signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        }).then((signature) => {
          const { profileId, metadata } = typedData?.value
          const { v, r, s } = splitSignature(signature)
          const inputStruct = {
            user: currentUser?.ownedBy,
            profileId,
            metadata,
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

  useEffect(() => {
    // @ts-ignore
    if (profile?.coverPicture?.original?.url)
      // @ts-ignore
      setCover(profile?.coverPicture?.original?.url)
  }, [profile])

  const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    evt.preventDefault()
    setUploading(true)
    try {
      // @ts-ignore
      const attachment = await uploadAssetsToIPFS(evt.target.files[0])
      setCover(attachment.item)
    } finally {
      setUploading(false)
    }
  }

  const form = useZodForm({
    schema: editProfileSchema,
    defaultValues: {
      name: profile?.name as string,
      location: profile?.location as string,
      website: profile?.website as string,
      twitter: profile?.twitterUrl?.replace(
        'https://twitter.com/',
        ''
      ) as string,
      bio: profile?.bio as string
    }
  })

  const editProfile = async (
    name: string,
    location: string | null,
    website: string | null,
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
        social: [
          {
            traitType: 'string',
            key: 'website',
            value: website
          },
          {
            traitType: 'string',
            key: 'twitter',
            value: twitter
          }
        ],
        bio,
        cover_picture: cover,
        location,
        attributes: [
          {
            traitType: 'boolean',
            key: 'isBeta',
            value: false
          },
          {
            traitType: 'string',
            key: 'app',
            value: 'Lenster'
          }
        ],
        version: '1.0.0',
        metadata_id: uuidv4(),
        appId: 'Lenster'
      }).finally(() => setIsUploading(false))

      console.log(path)

      // createSetProfileMetadataTypedData({
      //   variables: {
      //     request: {
      //       profileId: currentUser?.id,
      //       metadata: `https://ipfs.infura.io/ipfs/${path}`
      //     }
      //   }
      // })
    }
  }

  return (
    <Card>
      <CardBody className="space-y-4">
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
            placeholder="John Doe"
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
            placeholder="https://lens.codes"
            {...form.register('website')}
          />
          <Input
            label="Twitter"
            type="text"
            prefix="https://twitter.com"
            placeholder="johndoe"
            {...form.register('twitter')}
          />
          <TextArea
            label="Bio"
            placeholder="Tell us something about you!"
            {...form.register('bio')}
          />
          <div className="space-y-1.5">
            <label>Cover</label>
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
          <div className="ml-auto">
            {activeChain?.unsupported ? (
              <SwitchNetwork />
            ) : (
              <Button
                type="submit"
                disabled={
                  isUploading || typedDataLoading || signLoading || writeLoading
                }
                icon={
                  isUploading ||
                  typedDataLoading ||
                  signLoading ||
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
          </div>
        </Form>
      </CardBody>
    </Card>
  )
}

export default Profile
