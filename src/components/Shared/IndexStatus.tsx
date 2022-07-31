import { useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { TX_STATUS_QUERY } from '@gql/HasTxHashBeenIndexed'
import { CheckCircleIcon } from '@heroicons/react/solid'
import Logger from '@lib/logger'
import clsx from 'clsx'
import React, { FC, useState } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

interface Props {
  type?: string
  txHash: string
  reload?: boolean
}

const IndexStatus: FC<Props> = ({
  type = 'Transaction',
  txHash,
  reload = false
}) => {
  const [hide, setHide] = useState<boolean>(false)
  const [pollInterval, setPollInterval] = useState<number>(500)
  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval,
    onCompleted(data) {
      if (data?.hasTxHashBeenIndexed?.indexed) {
        setPollInterval(0)
        if (reload) {
          location.reload()
        }
        setTimeout(() => {
          setHide(true)
        }, 5000)
      }
    },
    onError(error) {
      Logger.error('[Query Error]', error)
    }
  })

  return (
    <a
      className={clsx({ hidden: hide }, 'ml-auto text-sm font-medium')}
      href={`${POLYGONSCAN_URL}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer noopener"
    >
      {loading || !data?.hasTxHashBeenIndexed?.indexed ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{type} Indexing</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <div className="text-black dark:text-white">Index Successful</div>
        </div>
      )}
    </a>
  )
}

export default IndexStatus
