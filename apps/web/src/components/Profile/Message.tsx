import { Button } from '@components/UI/Button';
import { Tooltip } from '@components/UI/Tooltip';
import { MailIcon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';

interface Props {
  onClick: () => void;
}

const Message: FC<Props> = ({ onClick }) => {
  return (
    <Tooltip content={t`Message`} placement="top" withDelay>
      <Button
        className="!px-3 !py-1.5 text-sm"
        icon={<MailIcon className="h-5 w-5" />}
        outline
        onClick={onClick}
        aria-label="Message"
      />
    </Tooltip>
  );
};

export default Message;
