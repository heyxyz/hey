import { useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { TX_STATUS_QUERY } from '@gql/HasTxHashBeenIndexed'
import { CheckCircleIcon } from '@heroicons/react/solid'
import React, { FC, useState } from 'react'
import { POLYGONSCAN_URL } from 'src/constants'

interface Props {
  type: string
  txHash: string
}

const IndexStatus: FC<Props> = ({ type, txHash }) => {
  const [pollInterval, setPollInterval] = useState<number>(500)
  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval,
    onCompleted(data) {
      if (data?.hasTxHashBeenIndexed?.indexed) {
        setPollInterval(0)
      }
    }
  })

  return (
    <a
      className="ml-auto text-sm"
      href={`${POLYGONSCAN_URL}/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {loading || !data?.hasTxHashBeenIndexed?.indexed ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{type} Indexing</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <div className="text-black">Index Successful</div>
        </div>
      )}
    </a>
  )
}

export default IndexStatus
