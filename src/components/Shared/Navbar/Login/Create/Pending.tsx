import { useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { TX_STATUS_QUERY } from '@gql/HasTxHashBeenIndexed'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import React, { FC } from 'react'
import { IS_MAINNET } from 'src/constants'

interface Props {
  handle: string
  txHash: string
}

const Pending: FC<Props> = ({ handle, txHash }) => {
  const { data, loading } = useQuery(TX_STATUS_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval: 1000,
    onError(error) {
      Logger.error('[Query Error]', error.message)
    }
  })

  return (
    <div className="p-5 font-bold text-center">
      {loading || !data?.hasTxHashBeenIndexed?.indexed ? (
        <div className="space-y-3">
          <Spinner className="mx-auto" />
          <div>Account creation in progress, please wait!</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Account created successfully</div>
          <div className="pt-3">
            <a href={`/u/${handle}${IS_MAINNET ? '.lens' : '.test'}`}>
              <Button
                className="mx-auto"
                icon={<ArrowRightIcon className="mr-1 w-4 h-4" />}
              >
                Go to profile
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pending
