import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import { Button, Form, Input, useZodForm } from '@hey/ui';
import { type FC } from 'react';
import { useSendMessage } from 'src/hooks/messages/useSendMessage';
import { object, string } from 'zod';

const newMessageSchema = object({
  content: string()
    .min(1, { message: 'Content should not be empty' })
    .max(10000, {
      message: 'Content should not exceed 10000 characters'
    })
});

const Composer: FC = () => {
  const { sending, sendMessage } = useSendMessage();

  const form = useZodForm({
    schema: newMessageSchema
  });

  return (
    <Form
      form={form}
      onSubmit={async ({ content }) => {
        await sendMessage(content);
        form.reset();
      }}
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
