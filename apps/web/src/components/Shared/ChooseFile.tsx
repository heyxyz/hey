import type { ChangeEventHandler, FC } from 'react';

interface ChooseFileProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

const ChooseFile: FC<ChooseFileProps> = ({ onChange }) => {
  return (
    <input
      className="file:bg-brand-500 file:text-darker cursor-pointer rounded-full bg-white text-sm text-darker shadow-sm focus:border-brand-400 focus:outline-none"
      type="file"
      accept=".png, .jpg, .jpeg, .gif"
      onChange={onChange}
      onClick={(event) => {
        // reset the value so that an onChange event is generated also when the user selects the same filename again
        // this allows the user to make a new attempt with the same image
        (event.target as HTMLInputElement).value = '';
      }}
    />
  );
};

export default ChooseFile;
