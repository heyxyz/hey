import { useLazyQuery } from '@apollo/client'
import { SEARCH_USERS_QUERY } from '@components/Shared/Navbar/Search'
import Slug from '@components/Shared/Slug'
import { MediaSet, Profile } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import consoleLog from '@lib/consoleLog'
import isVerified from '@lib/isVerified'
import clsx from 'clsx'
import { Dispatch, FC } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

interface Props {
  value: string
  setValue: Dispatch<string>
  placeholder?: string
}

export const MentionTextArea: FC<Props> = ({
  value,
  setValue,
  placeholder = ''
}) => {
  const [searchUsers] = useLazyQuery(SEARCH_USERS_QUERY, {
    onCompleted(data) {
      consoleLog(
        'Lazy Query',
        '#8b5cf6',
        `Fetched ${data?.search?.items?.length} user mention result for ${value}`
      )
    }
  })

  const fetchUsers = (query: string, callback: any) => {
    if (!query) return

    searchUsers({
      variables: { request: { type: 'PROFILE', query, limit: 5 } }
    })
      .then(({ data }) =>
        data?.search?.items?.map((user: Profile & { picture: MediaSet }) => ({
          uid: user.id,
          id: user.handle,
          display: user.handle,
          name: user?.name ?? user?.handle,
          picture:
            user?.picture?.original?.url ??
            `https://avatar.tobi.sh/${user?.handle}.png`
        }))
      )
      .then(callback)
  }

  return (
    <MentionsInput
      className="mention-input h-16 mb-2"
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        setValue(e.target.value)
      }}
    >
      <Mention
        trigger="@"
        displayTransform={(login) => `@${login}`}
        // @ts-ignore
        renderSuggestion={(
          suggestion: {
            uid: string
            id: string
            display: string
            name: string
            picture: string
          },
          search,
          highlightedDisplay,
          index,
          focused
        ) => (
          <div
            className={clsx(
              { 'bg-gray-100': focused },
              'flex items-center space-x-2 m-1.5 px-3 py-1.5 rounded-xl'
            )}
          >
            <img
              className="h-8 w-8 rounded-full"
              src={suggestion.picture}
              alt={suggestion.id}
            />
            <div className="truncate flex flex-col">
              <div className="flex gap-1 items-center">
                <div className="truncate text-sm">{suggestion.name}</div>
                {isVerified(suggestion.uid) && (
                  <BadgeCheckIcon className="w-3 h-3 text-brand" />
                )}
              </div>
              <Slug className="text-xs" slug={suggestion.id} prefix="@" />
            </div>
          </div>
        )}
        data={fetchUsers}
      />
    </MentionsInput>
  )
}
