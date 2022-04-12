import { useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { HAS_PUBLICATION_INDEXED_QUERY } from '@gql/HasPublicationIndexedQuery'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { FC } from 'react'

interface Props {
  txHash: string
  indexing: string
  indexed: string
  type: string
  urlPrefix: string
}

const Pending: FC<Props> = ({ txHash, indexing, indexed, type, urlPrefix }) => {
  const { data, loading } = useQuery(HAS_PUBLICATION_INDEXED_QUERY, {
    variables: {
      request: { txHash }
    },
    pollInterval: 1000
  })

  return (
    <div className="p-5 py-10 font-bold text-center">
      {loading || !data?.publication?.id ? (
        <div className="space-y-3">
          <Spinner className="mx-auto" />
          <div>{indexing}</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>{indexed}</div>
          <div className="pt-3">
            <Link href={`/${urlPrefix}/${data?.publication?.id}`}>
              <a>
                <Button
                  className="mx-auto"
                  icon={<ArrowRightIcon className="w-4 h-4 mr-1" />}
                >
                  Go to {type}
                </Button>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pending
