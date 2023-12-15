import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { HEY_API_URL } from '@hey/data/constants';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import axios from 'axios';
import { type FC, useState } from 'react';
import { useMessageStore } from 'src/store/persisted/useMessageStore';
import { object, string } from 'zod';

const newMessageSchema = object({
  content: string()
    .min(1, { message: 'Content should not be empty' })
    .max(10000, {
      message: 'Content should not exceed 10000 characters'
    })
});

const Composer: FC = () => {
  const {
    conversations,
    messages,
    selectedConversation,
    setConversations,
    setMessages
  } = useMessageStore();
  const [sending, setSending] = useState(false);

  const form = useZodForm({
    schema: newMessageSchema
  });

  const sendMessage = async (content: string) => {
    const newMessage = await axios.post(
      `${HEY_API_URL}/message/send`,
      { content, conversationId: selectedConversation?.id },
      { headers: getAuthWorkerHeaders() }
    );
    setSending(false);
    form.reset();

    // Update messages to push the new message
    setMessages(
      messages
        ? [...messages, newMessage.data.message]
        : [newMessage.data.message]
    );

    // Update conversations to show the latest message
    setConversations(
      conversations?.length
        ? conversations.map((conversation) => {
            if (conversation.id === selectedConversation?.id) {
              return {
                ...conversation,
                latestMessages: newMessage.data.message.content
              };
            }
            return conversation;
          })
        : []
    );
  };

  return (
    <Form
      form={form}
      onSubmit={async ({ content }) => await sendMessage(content)}
    >
      <div className="flex items-center space-x-3 p-5">
        <Input
          placeholder="Type a message"
          {...form.register('content')}
          disabled={sending}
          hideError
        />
        <Button
          className="py-2"
          disabled={sending}
          icon={<ArrowRightCircleIcon className="h-5 w-5" />}
          size="lg"
        >
          Send
        </Button>
      </div>
    </Form>
  );
};

export default Composer;
