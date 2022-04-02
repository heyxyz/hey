import { gql, useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import SwitchNetwork from '@components/Shared/SwitchNetwork'
import { Button } from '@components/UI/Button'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { PlusIcon } from '@heroicons/react/outline'
import { trackEvent } from '@lib/trackEvent'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import { uploadToIPFS } from '@lib/uploadToIPFS'
import React, { useState } from 'react'
import { useNetwork } from 'wagmi'
import { object, string } from 'zod'

import Pending from './Pending'

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfile($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
    }
  }
`

const newUserSchema = object({
  handle: string()
    .min(2, { message: 'Handle should be atleast 2 characters' })
    .max(31, { message: 'Handle should be less than 32 characters' })
    .regex(/^[a-z0-9]+$/, {
      message: 'Handle should only contain alphanumeric characters'
    })
})

const Create: React.FC = () => {
  const [avatar, setAvatar] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploading, setUploading] = useState<boolean>(false)
  const [{ data: network }] = useNetwork()
  const [createProfile, { data, loading }] = useMutation(
    CREATE_PROFILE_MUTATION
  )

  const form = useZodForm({
    schema: newUserSchema
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

  return (
    <>
      {data?.createProfile?.txHash ? (
        <Pending
          handle={form.getValues('handle')}
          txHash={data?.createProfile?.txHash}
        />
      ) : (
        <Form
          form={form}
          className="space-y-4"
          onSubmit={async ({ handle }) => {
            setIsUploading(true)
            const username = handle.toLowerCase()
            const { path } = await uploadToIPFS({
              name: `${username}'s follower NFT`,
              description: `${username}'s last publication will show within this NFT`,
              animation_url: `https://nft.lenster.xyz/follow?handle=${username}&isTestNet=1`,
              image: 'QmUXU4mCE3sxmfuFFFzSrs5VH5yNKjvVewkLtd6hBhcHCn'
            }).finally(() => setIsUploading(false))

            trackEvent('signup')
            createProfile({
              variables: {
                request: {
                  handle: username,
                  profilePictureUri: avatar
                    ? avatar
                    : `https://avatar.tobi.sh/${username}.svg`
                  // followNFTURI: `https://ipfs.infura.io/ipfs/${path}`
                }
              }
            })
          }}
        >
          {data?.createProfile?.reason && (
            <ErrorMessage
              className="mb-3"
              title="Create profile failed!"
              error={{
                name: 'Create profile failed!',
                message: data?.createProfile?.reason
              }}
            />
          )}
          <Input
            label="Handle"
            type="text"
            placeholder="justinbieber"
            prefix="https://lenster.xyz/u/"
            {...form.register('handle')}
          />
          <div className="space-y-1.5">
            <label>Avatar</label>
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
              <div>
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
          </div>
          <div className="ml-auto">
            {network.chain?.unsupported ? (
              <SwitchNetwork />
            ) : (
              <Button
                type="submit"
                disabled={isUploading || loading}
                icon={
                  isUploading || loading ? (
                    <Spinner size="xs" />
                  ) : (
                    <PlusIcon className="w-4 h-4" />
                  )
                }
              >
                Signup
              </Button>
            )}
          </div>
        </Form>
      )}
    </>
  )
}

export default Create
