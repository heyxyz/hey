import { useLazyQuery } from '@apollo/client'
import { SEARCH_USERS_QUERY } from '@components/Shared/Navbar/Search'
import { Profile } from '@generated/types'
import consoleLog from '@lib/consoleLog'
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
      variables: { request: { type: 'PROFILE', query, limit: 8 } }
    })
      .then(({ data }) =>
        data?.search?.items?.map((user: Profile) => ({
          id: user.handle,
          display: user.handle
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
        data={fetchUsers}
      />
    </MentionsInput>
  )
}
