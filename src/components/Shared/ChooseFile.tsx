import { ChangeEventHandler } from 'react'

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>
}

const ChooseFile: React.FC<Props> = ({ onChange }) => {
  return (
    <input
      className="pr-1 text-sm text-gray-700 bg-white rounded-xl border border-gray-300 shadow-sm cursor-pointer dark:text-white dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:border-brand-400"
      type="file"
      accept="image/*"
      onChange={onChange}
    />
  )
}

export default ChooseFile
