import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';

type Props = {};

const Chat = (props: Props) => {
  return (
    <Button
      aria-label="Message"
      className="text-brand-900 border-brand-900 hover:bg-brand-200 !px-3 !py-1.5 text-sm"
      icon={<EnvelopeIcon className="size-4" />}
      outline
    >
      Message
    </Button>
  );
};

export default Chat;
