import { gql, useQuery } from '@apollo/client'
import { GridItemSix, GridLayout } from '@components/GridLayout'
import SEO from '@components/utils/SEO'
import { CommunityFields } from '@gql/CommunityFields'
import { ChartBarIcon, FireIcon } from '@heroicons/react/outline'
import consoleLog from '@lib/consoleLog'
import { NextPage } from 'next'
import React from 'react'
import Custom500 from 'src/pages/500'

import List from './List'

const COMMUNITY_QUERY = gql`
  query (
    $topCommented: ExplorePublicationRequest!
    $topCollected: ExplorePublicationRequest!
  ) {
    topCommented: explorePublications(request: $topCommented) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
    topCollected: explorePublications(request: $topCollected) {
      items {
        ... on Post {
          ...CommunityFields
        }
      }
    }
  }
  ${CommunityFields}
`

const Communities: NextPage = () => {
  const { data, loading, error } = useQuery(COMMUNITY_QUERY, {
    variables: {
      topCommented: {
        sources: 'Lenster Community',
        sortCriteria: 'TOP_COMMENTED',
        publicationTypes: ['POST'],
        limit: 8
      },
      topCollected: {
        sources: 'Lenster Community',
        sortCriteria: 'TOP_COLLECTED',
        publicationTypes: ['POST'],
        limit: 8
      }
    },
    onCompleted() {
      consoleLog(
        'Query',
        '#8b5cf6',
        `Fetched 10 TOP_COMMENTED and TOP_COLLECTED communities`
      )
    }
  })

  if (error) return <Custom500 />
  if (loading || !data)
    return (
      <div className="container mx-auto max-w-screen-xl flex-grow py-8 px-0 sm:px-5 ">
        <div className="grid grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 md:col-span-12 col-span-12 ">
            <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 h-5 text-yellow-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                ></path>
              </svg>
              <div>Most Active</div>
            </div>
            <div className="rounded-none sm:rounded-xl border dark:border-gray-700/80 bg-white dark:bg-gray-900">
              {new Array(8).fill('shimmer').map((value, index) => (
                <div
                  className="p-5 space-y-6 flex"
                  key={`left-shimmer-${index}`}
                >
                  <div className="flex items-center space-x-3 grow">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl border shimmer dark:border-gray-700/80"></div>
                    <div className="space-y-1 grow">
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-6 md:col-span-12 col-span-12 ">
            <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 h-5 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
              <div>Fastest Growing</div>
            </div>
            <div className="rounded-none sm:rounded-xl border dark:border-gray-700/80 bg-white dark:bg-gray-900">
              {new Array(8).fill('shimmer').map((value, index) => (
                <div
                  className="p-5 space-y-6 flex"
                  key={`right-shimmer-${index}`}
                >
                  <div className="flex items-center space-x-3 grow">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl border shimmer dark:border-gray-700/80"></div>
                    <div className="space-y-1 grow">
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                      <div className="h-4 shimmer bg-gray-200 rounded-md w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )

  return (
    <GridLayout>
      <SEO title="Communities • Lenster" />
      <GridItemSix>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <FireIcon className="w-5 h-5 text-yellow-500" />
          <div>Most Active</div>
        </div>
        <List communities={data?.topCommented.items} />
      </GridItemSix>
      <GridItemSix>
        <div className="flex items-center mb-2 space-x-1.5 font-bold text-gray-500">
          <ChartBarIcon className="w-5 h-5 text-green-500" />
          <div>Fastest Growing</div>
        </div>
        <List communities={data?.topCollected.items} />
      </GridItemSix>
    </GridLayout>
  )
}

export default Communities
