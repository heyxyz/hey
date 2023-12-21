import type { NextPage } from 'next';

import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { CheckCircleIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { APP_NAME, HEY_API_URL } from '@hey/data/constants';
import { PAGEVIEW } from '@hey/data/tracking';
import {
  Button,
  Card,
  EmptyState,
  Form,
  GridItemEight,
  GridItemFour,
  GridLayout,
  Input,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useProfileStore from 'src/store/persisted/useProfileStore';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

const newTicketSchema = object({
  email: string().email({ message: 'Email is not valid' }),
  message: string()
    .min(1, { message: 'Message should not be empty' })
    .max(5000, {
      message: 'Message should not exceed 5000 characters'
    }),
  subject: string()
    .min(1, { message: 'Subject should not be empty' })
    .max(260, {
      message: 'Subject should not exceed 260 characters'
    })
});

const Support: NextPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useZodForm({
    schema: newTicketSchema
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'support' });
  });

  const createTicket = async (
    email: string,
    subject: string,
    message: string
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${HEY_API_URL}/support/create`, {
        email,
        handle: currentProfile?.handle?.suggestedFormatted.localName || email,
        message,
        subject
      });

      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data?.message || Errors.SomethingWentWrong);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GridLayout>
      <MetaTags title={`Support • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          description="Contact us to help you get the issue resolved."
          heading={`Contact ${APP_NAME}`}
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {submitted ? (
            <EmptyState
              hideCard
              icon={<CheckCircleIcon className="size-14 text-green-500" />}
              message="We have received your message and will get back to you as soon as possible."
            />
          ) : (
            <Form
              className="space-y-4 p-5"
              form={form}
              onSubmit={async ({ email, message, subject }) => {
                await createTicket(email, subject, message);
              }}
            >
              <Input
                label="Email"
                placeholder="gavin@hooli.com"
                {...form.register('email')}
              />
              <Input
                label="Subject"
                placeholder="What happened?"
                {...form.register('subject')}
              />
              <TextArea
                label="Message"
                placeholder="How can we help?"
                rows={7}
                {...form.register('message')}
              />
              <div className="ml-auto">
                <Button
                  disabled={submitting}
                  icon={
                    submitting ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilIcon className="size-5" />
                    )
                  }
                  type="submit"
                >
                  Submit
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Support;
