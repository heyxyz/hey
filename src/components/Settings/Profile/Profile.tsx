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
import trackEvent from '@lib/trackEvent'
import uploadAssetsToIPFS from '@lib/uploadAssetsToIPFS'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ERROR_MESSAGE } from 'src/constants'
import { useNetwork } from 'wagmi'
import { object, string } from 'zod'

const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($request: UpdateProfileRequest!) {
    updateProfile(request: $request) {
      id
      name
      location
      website
      twitterUrl
      bio
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

const Profile: React.FC<Props> = ({ profile }) => {
  const [cover, setCover] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const [{ data: network }] = useNetwork()
  const [updateProfile, { loading, error }] = useMutation(
    UPDATE_PROFILE_MUTATION,
    {
      onCompleted() {
        toast.success('Profile updated successfully!')
        trackEvent('update profile')
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
      }
    }
  )

  useEffect(() => {
    // @ts-ignore
    if (profile?.coverPicture?.original?.url)
      // @ts-ignore
      setCover(profile?.coverPicture?.original?.url)
  }, [profile])

  const handleUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <Card>
      <CardBody className="space-y-4">
        <Form
          form={form}
          className="space-y-4"
          onSubmit={({ name, location, website, twitter, bio }) => {
            updateProfile({
              variables: {
                request: {
                  profileId: currentUser?.id,
                  name,
                  location,
                  bio,
                  website,
                  twitterUrl: twitter ? `https://twitter.com/${twitter}` : null,
                  coverPicture: cover ? cover : null
                }
              }
            })
          }}
        >
          <ErrorMessage
            className="mb-3"
            title="Transaction failed!"
            error={error}
          />
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
                    src={cover}
                    alt={cover}
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
          <div className="ml-auto">
            {network.chain?.unsupported ? (
              <SwitchNetwork />
            ) : (
              <Button
                type="submit"
                disabled={loading}
                icon={
                  loading ? (
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
