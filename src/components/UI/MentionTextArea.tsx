import { useLazyQuery } from '@apollo/client'
import { SEARCH_USERS_QUERY } from '@components/Shared/Navbar/Search'
import Slug from '@components/Shared/Slug'
import { UserSuggestion } from '@generated/lenstertypes'
import { MediaSet, Profile } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import consoleLog from '@lib/consoleLog'
import imagekitURL from '@lib/imagekitURL'
import isVerified from '@lib/isVerified'
import clsx from 'clsx'
import { Dispatch, FC } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

interface UserProps {
  suggestion: UserSuggestion
  focused: boolean
}

const User: FC<UserProps> = ({ suggestion, focused }) => (
  <div
    className={clsx(
      { 'bg-gray-100 dark:bg-gray-800': focused },
      'flex items-center space-x-2 m-1.5 px-3 py-1.5 rounded-xl'
    )}
  >
    <img
      className="h-8 w-8 rounded-full"
      src={imagekitURL(suggestion.picture, 'avatar')}
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
)

interface Props {
  value: string
  setValue: Dispatch<string>
  error: string
  setError: Dispatch<string>
  placeholder?: string
}

export const MentionTextArea: FC<Props> = ({
  value,
  setValue,
  error,
  setError,
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
    <div className="mb-2">
      <MentionsInput
        className="mention-input h-16"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value)
          setError('')
        }}
      >
        <Mention
          trigger="@"
          displayTransform={(login) => `@${login} `}
          markup="@__id__ "
          // @ts-ignore
          renderSuggestion={(
            suggestion: UserSuggestion,
            search,
            highlightedDisplay,
            index,
            focused
          ) => <User suggestion={suggestion} focused={focused} />}
          data={fetchUsers}
        />
      </MentionsInput>
      {error && (
        <div className="mt-1 text-sm font-bold text-red-500">{error}</div>
      )}
    </div>
  )
}
