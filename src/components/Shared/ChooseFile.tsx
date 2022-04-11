import { ChangeEventHandler, FC } from 'react'

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>
}

const ChooseFile: FC<Props> = ({ onChange }) => {
  return (
    <input
      className="pr-1 text-sm text-gray-700 bg-white border border-gray-300 shadow-sm cursor-pointer rounded-xl dark:text-white dark:bg-gray-800 dark:border-gray-800 focus:outline-none focus:border-brand-400"
      type="file"
      accept="image/*"
      onChange={onChange}
    />
  )
}

export default ChooseFile
