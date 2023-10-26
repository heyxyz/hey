import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';
import type { FC } from 'react';

interface MessageProps {
  onClick: () => void;
}

const Message: FC<MessageProps> = ({ onClick }) => {
  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      icon={<EnvelopeIcon className="h-5 w-5" />}
      outline
      onClick={onClick}
      aria-label="Message"
    />
  );
};

export default Message;
