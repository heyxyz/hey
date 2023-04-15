import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import { APP_NAME, FRESHDESK_WORKER_URL } from 'data/constants';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PAGEVIEW } from 'src/tracking';
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
} from 'ui';
import { object, string } from 'zod';

const newContactSchema = object({
  email: string().email({ message: t`Email is not valid` }),
  subject: string()
    .min(1, { message: t`Subject should not be empty` })
    .max(260, {
      message: t`Subject should not exceed 260 characters`
    }),
  message: string()
    .min(1, { message: t`Message should not be empty` })
    .max(1000, {
      message: t`Message should not exceed 1000 characters`
    })
});

const Contact: FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'contact' });
  }, []);

  const form = useZodForm({
    schema: newContactSchema
  });

  const submitToFreshdesk = async (email: string, subject: string, body: string) => {
    setSubmitting(true);
    try {
      const { data } = await axios(FRESHDESK_WORKER_URL, {
        method: 'POST',
        data: { email, subject, body }
      });

      if (data.success) {
        setSubmitted(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GridLayout>
      <MetaTags title={t`Contact • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading={t`Contact ${APP_NAME}`}
          description={t`Contact us to help you get the issue resolved.`}
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {submitted ? (
            <EmptyState
              message={t`Your message has been sent!`}
              icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
              hideCard
            />
          ) : (
            <Form
              form={form}
              className="space-y-4 p-5"
              onSubmit={({ email, subject, message }) => {
                submitToFreshdesk(email, subject, message);
              }}
            >
              <Input label={t`Email`} placeholder="gavin@hooli.com" {...form.register('email')} />
              <Input label={t`Subject`} placeholder={t`What happened?`} {...form.register('subject')} />
              <TextArea label={t`Message`} placeholder={t`How can we help?`} {...form.register('message')} />
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={submitting}
                  leadingIcon={submitting ? <Spinner size="xs" /> : <PencilAltIcon className="h-4 w-4" />}
                >
                  <Trans>Submit</Trans>
                </Button>
              </div>
            </Form>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Contact;
