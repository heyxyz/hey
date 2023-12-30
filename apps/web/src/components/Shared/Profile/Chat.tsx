import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@hey/ui';

type Props = {};

const Chat = (props: Props) => {
  return (
    <Button
      aria-label="Chat"
      className="text-brand-900 border-brand-900 hover:bg-brand-200 !px-3 !py-1.5 text-sm"
      icon={<ChatBubbleLeftRightIcon className="size-4" />}
      outline
    >
      Chat
    </Button>
  );
};

export default Chat;
