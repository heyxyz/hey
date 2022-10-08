import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { ArrowRightIcon } from '@heroicons/react/outline';
import { FC, useState } from 'react';

interface Props {
  sendMessage: (message: string) => void;
}

const MessageComposer: FC<Props> = ({ sendMessage }) => {
  const [message, setMessage] = useState<string>('');

  const handleSend = () => {
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="flex p-4">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        type="text"
        placeholder="Type Something"
      />
      <Button
        onClick={handleSend}
        className="text-md ml-2 !px-4 !py-1.5 min-w-max"
        variant="primary"
        aria-label="Send message"
      >
        <div className="flex items-center">
          Send
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </div>
      </Button>
    </div>
  );
};

export default MessageComposer;
