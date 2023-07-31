import clsx from 'clsx';
import { type FC, type ReactNode, useId } from 'react';

interface RadioProps {
  title: ReactNode;
  value?: ReactNode;
  className?: string;
  name: string;
  onChange?: () => void;
}

export const Radio: FC<RadioProps> = ({
  title,
  value,
  className = '',
  name,
  onChange
}) => {
  const id = useId();

  if (!title) {
    return null;
  }

  return (
    <div className={clsx('flex items-center space-x-3', className)}>
      <input
        id={id}
        type="radio"
        name={name}
        className="text-brand dark:text-brand h-4 w-4 border focus:ring-0 focus:ring-offset-0"
        onChange={onChange}
      />
      <label htmlFor={id}>
        <div>{title}</div>
        {value ? <div className="text-sm">{value}</div> : null}
      </label>
    </div>
  );
};
