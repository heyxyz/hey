import { MailIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { Button } from 'ui';

interface MessageProps {
  onClick: () => void;
}

const Message: FC<MessageProps> = ({ onClick }) => {
  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      leadingIcon={<MailIcon className="h-5 w-5" />}
      outline
      onClick={onClick}
      aria-label="Message"
    />
  );
};

export default Message;
