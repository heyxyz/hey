import { gql, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Logger from '@lib/logger'
import Link from 'next/link'
import React, { FC } from 'react'

const HAS_PUBLICATION_INDEXED_QUERY = gql`
  query HasPubicationIndexed($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
    }
  }
`

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
    pollInterval: 1000,
    onError(error) {
      Logger.error('[Query Error]', error.message)
    }
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
              <a href={`/${urlPrefix}/${data?.publication?.id}`}>
                <Button
                  className="mx-auto"
                  icon={<ArrowRightIcon className="mr-1 w-4 h-4" />}
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
