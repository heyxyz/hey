import MetaTags from '@components/Common/MetaTags';
import SettingsHelper from '@components/Shared/SettingsHelper';
import { Button } from '@components/UI/Button';
import { Card } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { Form, useZodForm } from '@components/UI/Form';
import { GridItemEight, GridItemFour, GridLayout } from '@components/UI/GridLayout';
import { Input } from '@components/UI/Input';
import { TextArea } from '@components/UI/TextArea';
import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { t, Trans } from '@lingui/macro';
import { APP_NAME, CONTACT_EMAIL } from 'data/constants';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { object, string } from 'zod';

const newContactSchema = object({
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
  const { push } = useRouter();

  const form = useZodForm({
    schema: newContactSchema
  });

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
          {false ? (
            <EmptyState
              message={t`Publication reported successfully!`}
              icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
              hideCard
            />
          ) : (
            <Form
              form={form}
              className="space-y-4 p-5"
              onSubmit={({ subject, message }) => {
                location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                  subject
                )}&body=${encodeURIComponent(message)}`;
                push('/');
              }}
            >
              <Input label={t`Subject`} placeholder={t`What happened?`} {...form.register('subject')} />
              <TextArea label={t`Message`} placeholder={t`How can we help?`} {...form.register('message')} />
              <div className="ml-auto">
                <Button type="submit" icon={<PencilAltIcon className="h-4 w-4" />}>
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
