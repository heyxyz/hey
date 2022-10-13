import SettingsHelper from '@components/Shared/SettingsHelper';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { Form, useZodForm } from '@components/UI/Form';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Input } from '@components/UI/Input';
import { TextArea } from '@components/UI/TextArea';
import MetaTags from '@components/utils/MetaTags';
import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Leafwatch } from '@lib/leafwatch';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useEffect } from 'react';
import { APP_NAME, CONTACT_EMAIL } from 'src/constants';
import { PAGEVIEW } from 'src/tracking';
import { object, string } from 'zod';

const newContactSchema = object({
  subject: string().min(1, { message: 'Subject  should not be empty' }).max(260, {
    message: 'Subject should not exceed 260 characters'
  }),
  message: string().min(1, { message: 'Message should not be empty' }).max(1000, {
    message: 'Message should not exceed 1000 characters'
  })
});

const Contact: FC = () => {
  useEffect(() => {
    Leafwatch.track('Pageview', { path: PAGEVIEW.CONTACT });
  }, []);

  const { push } = useRouter();
  const form = useZodForm({
    schema: newContactSchema
  });

  return (
    <GridLayout>
      <MetaTags title={`Contact • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading={`Contact ${APP_NAME}`}
          description="Contact us to help you get the issue resolved."
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {false ? (
            <EmptyState
              message={<span>Publication reported successfully!</span>}
              icon={<CheckCircleIcon className="w-14 h-14 text-green-500" />}
              hideCard
            />
          ) : (
            <Form
              form={form}
              className="p-5 space-y-4"
              onSubmit={({ subject, message }) => {
                location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(message)}`;
                push('/');
              }}
            >
              <Input label="Subject" placeholder="What happened?" {...form.register('subject')} />
              <TextArea label="Message" placeholder="How can we help?" {...form.register('message')} />
              <div className="ml-auto">
                <Button type="submit" icon={<PencilAltIcon className="w-4 h-4" />}>
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

export default Contact;
