import { HEY_API_URL } from '@hey/data/constants';
import { Button, Input } from '@hey/ui';
import axios from 'axios';
import { type FC, useState } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';

const Composer: FC = () => {
  const { messages, selectedConversation, setMessages } = useMessageStore();

  const [message, setMessage] = useState<string>('test message');

  const sendMessage = async () => {
    const newMessage = await axios.post(`${HEY_API_URL}/message/send`, {
      content: message,
      conversationId: selectedConversation
    });

    setMessages(
      messages
        ? [...messages, newMessage.data.message]
        : [newMessage.data.message]
    );
  };

  return (
    <div className="flex items-center justify-between px-5 py-3">
      <div className="mr-3 w-full">
        <Input
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          value={message}
        />
      </div>
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
};

export default Composer;
