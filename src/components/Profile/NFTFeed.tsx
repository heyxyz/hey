import { gql, useQuery } from '@apollo/client'
import SingleNFT from '@components/NFT/SingleNFT'
import NFTSShimmer from '@components/Shared/Shimmer/NFTSShimmer'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Spinner } from '@components/UI/Spinner'
import { Nft, Profile } from '@generated/types'
import { CollectionIcon } from '@heroicons/react/outline'
import React from 'react'
import useInView from 'react-cool-inview'

const PROFILE_NFT_FEED_QUERY = gql`
  query ProfileNFTFeed($request: NFTsRequest!) {
    nfts(request: $request) {
      items {
        name
        collectionName
        contractAddress
        tokenId
        chainId
        originalContent {
          uri
        }
      }
      pageInfo {
        next
      }
    }
  }
`

interface Props {
  profile: Profile
}

const NFTFeed: React.FC<Props> = ({ profile }) => {
  const { data, loading, error, fetchMore } = useQuery(PROFILE_NFT_FEED_QUERY, {
    variables: {
      request: {
        chainIds: [80001, 42],
        ownerAddress: profile?.ownedBy,
        limit: 10
      }
    },
    skip: !profile.ownedBy
  })

  const pageInfo = data?.nfts?.pageInfo
  const { observe } = useInView({
    threshold: 1,
    onEnter: () => {
      fetchMore({
        variables: {
          request: {
            chainIds: [80001, 42],
            ownerAddress: profile?.ownedBy,
            cursor: pageInfo?.next,
            limit: 10
          }
        }
      })
    }
  })

  if (loading) return <NFTSShimmer />

  if (data?.nfts?.items?.length === 0)
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">@{profile.handle}</span>
            <span>seems like have no nfts!</span>
          </div>
        }
        icon={<CollectionIcon className="w-8 h-8 text-brand-500" />}
      />
    )

  return (
    <>
      {error && <ErrorMessage title="Failed to load nft feed" error={error} />}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {data?.nfts?.items?.map((nft: Nft, index: number) => (
          <SingleNFT key={`${nft.tokenId}_${index}`} nft={nft} />
        ))}
      </div>
      {pageInfo?.next && (
        <span ref={observe} className="flex justify-center p-5">
          <Spinner size="sm" />
        </span>
      )}
    </>
  )
}

export default NFTFeed
