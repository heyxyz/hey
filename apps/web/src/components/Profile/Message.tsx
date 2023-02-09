import { MailIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { Button } from 'web-ui';

interface Props {
  onClick: () => void;
}

const Message: FC<Props> = ({ onClick }) => {
  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      icon={<MailIcon className="h-5 w-5" />}
      outline
      onClick={onClick}
      aria-label="Message"
    />
  );
};

export default Message;
