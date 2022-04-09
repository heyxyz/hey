import { gql, useQuery } from '@apollo/client'
import { Button } from '@components/UI/Button'
import { Spinner } from '@components/UI/Spinner'
import { ArrowRightIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import React, { FC } from 'react'

const CROWDFUND_INDEXED_QUERY = gql`
  query HasCrowdfundCreated($request: PublicationQueryRequest!) {
    publication(request: $request) {
      ... on Post {
        id
      }
    }
  }
`

interface Props {
  txHash: string
}

const Pending: FC<Props> = ({ txHash }) => {
  const { data, loading } = useQuery(CROWDFUND_INDEXED_QUERY, {
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
          <div>Crowdfund creation in progress, please wait!</div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-[40px]">🌿</div>
          <div>Crowdfund created successfully</div>
          <div className="pt-3">
            <Link href={`/posts/${data?.publication?.id}`}>
              <a>
                <Button
                  className="mx-auto"
                  icon={<ArrowRightIcon className="w-4 h-4 mr-1" />}
                >
                  Go to crowdfund
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
