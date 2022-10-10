import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { ArrowRightIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
import { useState } from 'react';

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
    <div className="flex space-x-4 p-4">
      <Input
        type="text"
        placeholder="Type Something"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <Button onClick={handleSend} variant="primary" aria-label="Send message">
        <div className="flex items-center">
          <span>Send</span>
          <ArrowRightIcon className="h-5 w-5 ml-2" />
        </div>
      </Button>
    </div>
  );
};

export default MessageComposer;
