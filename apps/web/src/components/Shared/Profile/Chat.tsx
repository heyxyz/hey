import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';
import Link from 'next/link';

type Props = {
  id: string;
};

const Chat = ({ id }: Props) => {
  return (
    <Link href={`/messages/${id}`}>
      <Button
        aria-label="Message"
        className="text-brand-900 border-brand-900 hover:bg-brand-200 !px-3 !py-1.5 text-sm"
        icon={<EnvelopeIcon className="size-4" />}
        outline
      >
        Message
      </Button>
    </Link>
  );
};

export default Chat;
