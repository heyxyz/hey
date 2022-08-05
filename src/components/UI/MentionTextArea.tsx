import { useLazyQuery } from '@apollo/client'
import { SEARCH_USERS_QUERY } from '@components/Shared/Navbar/Search'
import Slug from '@components/Shared/Slug'
import { UserSuggestion } from '@generated/lenstertypes'
import { MediaSet, NftImage, Profile } from '@generated/types'
import { BadgeCheckIcon } from '@heroicons/react/solid'
import imagekitURL from '@lib/imagekitURL'
import isVerified from '@lib/isVerified'
import clsx from 'clsx'
import { Dispatch, FC, SetStateAction } from 'react'
import { Mention, MentionsInput } from 'react-mentions'

interface UserProps {
  suggestion: UserSuggestion
  focused: boolean
}

const User: FC<UserProps> = ({ suggestion, focused }) => (
  <div
    className={clsx(
      { 'dropdown-active': focused },
      'flex items-center space-x-2 m-1.5 px-3 py-1 rounded-xl'
    )}
  >
    <img
      className="w-7 h-7 rounded-full"
      height={32}
      width={32}
      src={imagekitURL(suggestion.picture, 'avatar')}
      alt={suggestion.id}
    />
    <div className="flex flex-col truncate">
      <div className="flex gap-1 items-center">
        <div className="text-sm truncate">{suggestion.name}</div>
        {isVerified(suggestion.uid) && (
          <BadgeCheckIcon className="w-3 h-3 text-brand" />
        )}
      </div>
      <Slug className="text-xs" slug={suggestion.id} prefix="@" />
    </div>
  </div>
)

interface Props {
  publication: string
  setPublication: Dispatch<SetStateAction<string>>
  error: string
  setError: Dispatch<string>
  placeholder?: string
}

export const MentionTextArea: FC<Props> = ({
  publication,
  setPublication,
  error,
  setError,
  placeholder = ''
}) => {
  const [searchUsers] = useLazyQuery(SEARCH_USERS_QUERY)

  const fetchUsers = (query: string, callback: any) => {
    if (!query) return

    searchUsers({
      variables: { request: { type: 'PROFILE', query, limit: 5 } }
    })
      .then(({ data }) =>
        data?.search?.items?.map(
          (user: Profile & { picture: MediaSet & NftImage }) => ({
            uid: user.id,
            id: user.handle,
            display: user.handle,
            name: user?.name ?? user?.handle,
            picture:
              user?.picture?.original?.url ??
              user?.picture?.uri ??
              `https://avatar.tobi.sh/${user?.id}_${user?.handle}.png`
          })
        )
      )
      .then(callback)
  }

  return (
    <div className="mb-2">
      <MentionsInput
        className="mention-input"
        value={publication}
        placeholder={placeholder}
        onChange={(e) => {
          setPublication(e.target.value)
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
