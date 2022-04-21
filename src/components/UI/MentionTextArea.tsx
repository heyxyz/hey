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
  return (
    <MentionsInput
      className="mention-input h-16 mb-2"
      value={value}
      placeholder={placeholder}
      onChange={(e) => setValue(e.target.value)}
    >
      <Mention
        trigger="@"
        data={[
          { id: 'yoginth', display: 'yoginth' },
          { id: 'filip', display: 'filip' }
        ]}
      />
    </MentionsInput>
  )
}
