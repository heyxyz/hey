import LensHubProxy from '@abis/LensHubProxy.json'
import ChooseFile from '@components/Shared/ChooseFile'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import AppContext from '@components/utils/AppContext'
import { Profile } from '@generated/types'
import { PencilIcon, SwitchHorizontalIcon } from '@heroicons/react/outline'
import { uploadAssetsToIPFS } from '@lib/uploadAssetsToIPFS'
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { CONNECT_WALLET, LENSHUB_PROXY, WRONG_NETWORK } from 'src/constants'
import { useAccount, useContractWrite, useNetwork } from 'wagmi'

interface Props {
  profile: Profile
}

const Picture: React.FC<Props> = ({ profile }) => {
  const [avatar, setAvatar] = useState<string>()
  const [uploading, setUploading] = useState<boolean>(false)
  const { currentUser } = useContext(AppContext)
  const [{ data: network }, switchNetwork] = useNetwork()
  const [{ data: account }] = useAccount()

  useEffect(() => {
    // @ts-ignore
    if (profile?.picture?.original?.url)
      // @ts-ignore
      setAvatar(profile?.picture?.original?.url)
  }, [profile])

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

  const [{ error, loading: writeLoading }, write] = useContractWrite(
    {
      addressOrName: LENSHUB_PROXY,
      contractInterface: LensHubProxy
    },
    'setProfileImageURI'
  )

  const editProfile = async (avatar: string | undefined) => {
    if (!avatar) {
      toast.error("Avatar can't be empty!")
    } else if (!account?.address) {
      toast.error(CONNECT_WALLET)
    } else if (network.chain?.id !== 80001) {
      toast.error(WRONG_NETWORK)
    } else {
      write({ args: [currentUser?.id, avatar] }).then((res) => {
        if (!res.error) {
          toast.success('Avatar updated successfully!')
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
          <label>Avatar</label>
          <div className="space-y-3">
            {avatar && (
              <div>
                <img
                  className="rounded-lg h-60 w-60"
                  style={{
                    // @ts-ignore
                    backgroundColor: `#${profile?.picture?.original?.url}`
                  }}
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
            disabled={writeLoading}
            onClick={() => editProfile(avatar)}
            icon={
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
      </CardBody>
    </Card>
  )
}

export default Picture
