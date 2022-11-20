import type { ChangeEventHandler, FC } from 'react';

interface Props {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<Props> = ({ onChange }) => {
  return (
    <input
      className="pr-1 text-sm text-gray-700 bg-white rounded-xl border border-gray-300 shadow-sm cursor-pointer dark:text-white dark:bg-gray-800 focus:outline-none dark:border-gray-700/80 focus:border-brand-400"
      type="file"
      accept=".png, .jpg, .jpeg, .gif"
      onChange={onChange}
    />
  );
};

export default ChooseFile;
