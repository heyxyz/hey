import type { FC } from 'react';

import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';

interface MessageProps {
  onClick: () => void;
}

const Message: FC<MessageProps> = ({ onClick }) => {
  return (
    <Button
      aria-label="Message"
      className="!px-3 !py-1.5 text-sm"
      icon={<EnvelopeIcon className="h-5 w-5" />}
      onClick={onClick}
      outline
    />
  );
};

export default Message;
