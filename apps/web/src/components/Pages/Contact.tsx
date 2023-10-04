import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { APP_NAME, FRESHDESK_WORKER_URL } from '@hey/data/constants';
import { Errors } from '@hey/data/errors';
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
  Select,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import axios from 'axios';
import type { FC } from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

const newContactSchema = object({
  email: string().email({ message: t`Email is not valid` }),
  category: string(),
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
  const currentProfile = useAppStore((state) => state.currentProfile);

  const form = useZodForm({
    schema: newContactSchema
  });

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'contact' });
  });

  const submitToFreshdesk = async (
    email: string,
    category: string,
    subject: string,
    body: string
  ) => {
    setSubmitting(true);
    try {
      const { data } = await axios.post(FRESHDESK_WORKER_URL, {
        email,
        profile: currentProfile
          ? {
              id: currentProfile?.id,
              handle: currentProfile?.handle
            }
          : null,
        category,
        subject,
        body
      });

      if (data.success) {
        setSubmitted(true);
      } else {
        toast.error(data?.message ?? Errors.SomethingWentWrong);
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
              onSubmit={({ email, category, subject, message }) => {
                submitToFreshdesk(email, category, subject, message);
              }}
            >
              <Input
                label={t`Email`}
                placeholder="gavin@hooli.com"
                {...form.register('email')}
              />
              <Select
                label={t`Category`}
                values={[
                  t`Support`,
                  t`Bug report`,
                  t`Feature request`,
                  t`Report copyright infringement`,
                  t`Other`
                ]}
                {...form.register('category')}
              />
              <Input
                label={t`Subject`}
                placeholder={t`What happened?`}
                {...form.register('subject')}
              />
              <TextArea
                label={t`Message`}
                placeholder={t`How can we help?`}
                {...form.register('message')}
              />
              <div className="ml-auto">
                <Button
                  type="submit"
                  disabled={submitting}
                  icon={
                    submitting ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilSquareIcon className="h-5 w-5" />
                    )
                  }
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
