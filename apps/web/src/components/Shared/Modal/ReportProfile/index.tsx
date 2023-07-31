import { PencilAltIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { Button, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { type FC } from 'react';
import { object, string, z } from 'zod';

const ReportType = z.enum(['MISLEADING_ACCOUNT', 'UNWANTED_CONTENT']);

const reportReportProfileSchema = object({
  type: ReportType,
  description: string().max(300, {
    message: t`Report should not exceed 300 characters`
  })
});

interface ReportProfileProps {
  profile: Profile | null;
}

const ReportProfile: FC<ReportProfileProps> = ({ profile }) => {
  const form = useZodForm({
    schema: reportReportProfileSchema
  });

  return (
    <div className="flex flex-col space-y-2 p-5">
      <Form
        className="space-y-4"
        form={form}
        onSubmit={({ type, description }) => {
          console.log({ type, description, profile: profile?.id });
        }}
      >
        <div className="space-y-5">
          <Radio
            heading={
              <span className="font-medium">
                <Trans>Misleading Account</Trans>
              </span>
            }
            description={t`Impersonation or false claims about identity or affiliation`}
            {...form.register('type')}
          />
          <Radio
            heading={
              <span className="font-medium">
                <Trans>Frequently Posts Unwanted Content</Trans>
              </span>
            }
            description={t`Spam; excessive mentions or replies`}
            {...form.register('type')}
          />
        </div>
        <div className="divider my-5" />
        <div>
          <TextArea
            label={t`Add details to report`}
            placeholder={t`Enter a reason or any other details here...`}
            {...form.register('description')}
          />
        </div>
        <Button
          className="flex w-full justify-center"
          type="submit"
          variant="primary"
          icon={<PencilAltIcon className="h-4 w-4" />}
          // disabled={!form.formState.isValid}
        >
          <Trans>Report</Trans>
        </Button>
      </Form>
    </div>
  );
};

export default ReportProfile;
