import { Button } from '@components/UI/Button';
import { MailIcon } from '@heroicons/react/outline';
import type { FC } from 'react';

interface Props {
  onClick: () => void;
}

const Message: FC<Props> = ({ onClick }) => {
  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      icon={<MailIcon className="h-5 w-5" />}
      outline
      onClick={onClick}
      variant="success"
      aria-label="Message"
    />
  );
};

export default Message;
