import { LensHubProxy } from '@abis/LensHubProxy'
import { gql, useMutation } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { Tooltip } from '@components/UI/Tooltip'
import { LensterPost } from '@generated/lenstertypes'
import { CreateMirrorBroadcastItemResult } from '@generated/types'
import { BROADCAST_MUTATION } from '@gql/BroadcastMutation'
import { SwitchHorizontalIcon } from '@heroicons/react/outline'
import humanize from '@lib/humanize'
import Logger from '@lib/logger'
import nFormatter from '@lib/nFormatter'
import omit from '@lib/omit'
import splitSignature from '@lib/splitSignature'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  ERROR_MESSAGE,
  ERRORS,
  LENSHUB_PROXY,
  RELAY_ON,
  SIGN_WALLET
} from 'src/constants'
import { useAppPersistStore, useAppStore } from 'src/store/app'
import { useContractWrite, useSignTypedData } from 'wagmi'

const CREATE_MIRROR_TYPED_DATA_MUTATION = gql`
  mutation CreateMirrorTypedData(
    $options: TypedDataOptions
    $request: CreateMirrorRequest!
  ) {
    createMirrorTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          profileIdPointed
          pubIdPointed
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`

interface Props {
  post: LensterPost
}

const Mirror: FC<Props> = ({ post }) => {
  const [count, setCount] = useState<number>(0)
  const [mirrored, setMirrored] = useState<boolean>(post?.mirrors?.length > 0)
  const { userSigNonce, setUserSigNonce } = useAppStore()
  const { isAuthenticated, currentUser } = useAppPersistStore()

  useEffect(() => {
    if (
      post?.mirrorOf?.stats?.totalAmountOfMirrors ||
      post?.stats?.totalAmountOfMirrors
    ) {
      setCount(
        post.__typename === 'Mirror'
          ? post?.mirrorOf?.stats?.totalAmountOfMirrors
          : post?.stats?.totalAmountOfMirrors
      )
    }
  }, [post])

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
    onError(error) {
      toast.error(error?.message)
    }
  })

  const onCompleted = () => {
    setCount(count + 1)
    setMirrored(true)
    toast.success('Post has been mirrored!')
  }
  const { isLoading: writeLoading, write } = useContractWrite({
    addressOrName: LENSHUB_PROXY,
    contractInterface: LensHubProxy,
    functionName: 'mirrorWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess() {
      onCompleted()
    },
    onError(error: any) {
      toast.error(error?.data?.message ?? error?.message)
    }
  })

  const [broadcast, { loading: broadcastLoading }] = useMutation(
    BROADCAST_MUTATION,
    {
      onCompleted,
      onError(error) {
        if (error.message === ERRORS.notMined) {
          toast.error(error.message)
        }
        Logger.error('[Broadcast Error]', error)
      }
    }
  )
  const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(
    CREATE_MIRROR_TYPED_DATA_MUTATION,
    {
      async onCompleted({
        createMirrorTypedData
      }: {
        createMirrorTypedData: CreateMirrorBroadcastItemResult
      }) {
        Logger.log('[Mutation]', 'Generated createMirrorTypedData')
        const { id, typedData } = createMirrorTypedData
        const {
          profileId,
          profileIdPointed,
          pubIdPointed,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          deadline
        } = typedData?.value

        try {
          const signature = await signTypedDataAsync({
            domain: omit(typedData?.domain, '__typename'),
            types: omit(typedData?.types, '__typename'),
            value: omit(typedData?.value, '__typename')
          })
          setUserSigNonce(userSigNonce + 1)
          const { v, r, s } = splitSignature(signature)
          const sig = { v, r, s, deadline }
          const inputStruct = {
            profileId,
            profileIdPointed,
            pubIdPointed,
            referenceModule,
            referenceModuleData,
            referenceModuleInitData,
            sig
          }
          if (RELAY_ON) {
            const {
              data: { broadcast: result }
            } = await broadcast({ variables: { request: { id, signature } } })

            if ('reason' in result)
              write?.({ recklesslySetUnpreparedArgs: inputStruct })
          } else {
            write?.({ recklesslySetUnpreparedArgs: inputStruct })
          }
        } catch (error) {
          Logger.warn('[Sign Error]', error)
        }
      },
      onError(error) {
        toast.error(error.message ?? ERROR_MESSAGE)
        Logger.error('[Typed-data Generate Error]', error)
      }
    }
  )

  const createMirror = () => {
    if (!isAuthenticated) return toast.error(SIGN_WALLET)

    createMirrorTypedData({
      variables: {
        options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentUser?.id,
          publicationId: post?.pubId ?? post?.id,
          referenceModule: {
            followerOnlyReferenceModule: false
          }
        }
      }
    })
  }

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={createMirror}
      disabled={typedDataLoading || writeLoading}
      aria-label="Mirror"
      data-test="publication-mirror"
    >
      <div
        className={clsx(
          mirrored ? 'text-green-500' : 'text-brand',
          'flex items-center space-x-1'
        )}
      >
        <div
          className={clsx(
            mirrored ? 'hover:bg-green-300' : 'hover:bg-brand-300',
            'p-1.5 rounded-full hover:bg-opacity-20'
          )}
        >
          {typedDataLoading ||
          signLoading ||
          writeLoading ||
          broadcastLoading ? (
            <Spinner size="xs" />
          ) : (
            <Tooltip
              placement="top"
              content={count > 0 ? `${humanize(count)} Mirrors` : 'Mirror'}
              withDelay
            >
              <SwitchHorizontalIcon className="w-[18px]" />
            </Tooltip>
          )}
        </div>
        {count > 0 && <div className="text-xs">{nFormatter(count)}</div>}
      </div>
    </motion.button>
  )
}

export default Mirror
