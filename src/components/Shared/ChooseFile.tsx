import { ChangeEventHandler } from 'react'

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>
}

const ChooseFile: React.FC<Props> = ({ onChange }) => {
  return (
    <input
      className="pr-1 text-sm text-gray-700 bg-white border border-gray-300 shadow-sm cursor-pointer dark:bg-gray-800 dark:text-white dark:border-gray-700 rounded-xl focus:border-brand-400 focus:outline-none"
      type="file"
      accept="image/*"
      onChange={onChange}
    />
  )
}

export default ChooseFile
