import { gql, useMutation } from '@apollo/client'
import ChooseFile from '@components/Shared/ChooseFile'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import { PlusIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
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
    .regex(/^[a-z0-9_\.]+$/, { message: 'Invalid handle' })
})

const Signup: React.FC = () => {
  const [avatar, setAvatar] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const [{ data: network }, switchNetwork] = useNetwork()
  const [createProfile, { data, loading }] = useMutation(
    CREATE_PROFILE_MUTATION
  )

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

  const form = useZodForm({
    schema: newUserSchema
  })

  return (
    <Card className="space-y-5">
      <CardBody className="space-y-4">
        {data?.createProfile?.txHash ? (
          <Pending
            handle={form.getValues('handle')}
            txHash={data?.createProfile?.txHash}
          />
        ) : (
          <Form
            form={form}
            className="space-y-4"
            onSubmit={({ handle }) => {
              createProfile({
                variables: {
                  request: {
                    handle,
                    profilePictureUri: avatar
                      ? avatar
                      : `https://avatar.tobi.sh/${handle}.svg`
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
              prefix="https://lenshub.io/u/"
              {...form.register('handle')}
            />
            <div className="space-y-1.5">
              <label>Avatar</label>
              <div className="space-y-3">
                {avatar && (
                  <div>
                    <img
                      className="rounded-lg h-60 w-60"
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
                <Button
                  variant="danger"
                  icon={<SwitchHorizontalIcon className="w-4 h-4" />}
                  // @ts-ignore
                  onClick={() => switchNetwork(80001)}
                >
                  Switch Network
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={loading}
                  icon={
                    loading ? (
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
      </CardBody>
    </Card>
  )
}

export default Signup
