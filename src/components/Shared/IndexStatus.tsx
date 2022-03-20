import { gql, useQuery } from '@apollo/client'
import { Spinner } from '@components/UI/Spinner'
import { CheckCircleIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'

export const TX_STATUS_QUERY = gql`
  query HasTxHashBeenIndexed($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        indexed
      }
    }
  }
`

interface Props {
  type: string
  txHash: string
}

const IndexStatus: React.FC<Props> = ({ type, txHash }) => {
  const [pollInterval, setPollInterval] = useState<number>(500)
  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval,
    onCompleted(data) {
      if (data.hasTxHashBeenIndexed.indexed) {
        setPollInterval(0)
      }
    }
  })

  return (
    <a
      className="text-sm"
      href={`https://mumbai.polygonscan.com/tx/${txHash}`}
      target="_blank"
      rel="noreferrer"
    >
      {loading || !data?.hasTxHashBeenIndexed?.indexed ? (
        <div className="flex items-center space-x-1.5">
          <Spinner size="xs" />
          <div>{type} Indexeing</div>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          <div>Index Successful</div>
        </div>
      )}
    </a>
  )
}

export default IndexStatus
