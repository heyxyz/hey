import { gql, useLazyQuery } from '@apollo/client'
import { Card } from '@components/UI/Card'
import { Input } from '@components/UI/Input'
import { Spinner } from '@components/UI/Spinner'
import useOnClickOutside from '@components/utils/hooks/useOnClickOutside'
import { Profile } from '@generated/types'
import { MinimalProfileFields } from '@gql/MinimalProfileFields'
import trackEvent from '@lib/trackEvent'
import { useRef, useState } from 'react'

import UserProfile from '../UserProfile'

const SEARCH_USERS_QUERY = gql`
  query SearchUsers($request: SearchQueryRequest!) {
    search(request: $request) {
      ... on ProfileSearchResult {
        items {
          ...MinimalProfileFields
        }
      }
    }
  }
  ${MinimalProfileFields}
`

const Search = () => {
  const [searchText, setSearchText] = useState<string>('')
  const dropdownRef = useRef(null)

  useOnClickOutside(dropdownRef, () => setSearchText(''))

  const [searchUsers, { data: searchUsersData, loading: searchUsersLoading }] =
    useLazyQuery(SEARCH_USERS_QUERY)

  const handleSearch = async (evt: any) => {
    let keyword = evt.target.value
    setSearchText(keyword)
    searchUsers({
      variables: { request: { type: 'PROFILE', query: keyword, limit: 8 } }
    })
  }

  return (
    <>
      <div onClick={() => trackEvent('search')}>
        <Input
          type="text"
          className="py-2 px-3 text-sm"
          placeholder="Search..."
          value={searchText}
          onChange={handleSearch}
        />
      </div>
      {searchText.length > 0 && (
        <div
          className="flex absolute flex-col mt-2 w-full sm:max-w-md"
          ref={dropdownRef}
        >
          <Card className="overflow-y-auto py-2 max-h-[80vh]">
            {searchUsersLoading ? (
              <div className="py-2 px-4 space-y-2 text-sm font-bold text-center">
                <Spinner size="sm" className="mx-auto" />
                <div>Searching users</div>
              </div>
            ) : (
              <>
                {searchUsersData?.search?.items?.map((profile: Profile) => (
                  <div
                    key={profile.handle}
                    className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setSearchText('')}
                  >
                    <UserProfile profile={profile} />
                  </div>
                ))}
                {searchUsersData?.search?.items?.length === 0 && (
                  <div className="py-2 px-4">No matching users</div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </>
  )
}

export default Search
