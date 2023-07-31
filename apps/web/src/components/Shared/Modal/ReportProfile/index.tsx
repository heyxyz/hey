import { PencilAltIcon } from '@heroicons/react/outline';
import type { Profile } from '@lenster/lens';
import { Button, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { type FC, useState } from 'react';
import { object, string } from 'zod';

const reportProfileSchema = object({
  report: string().max(300, {
    message: t`Report should not exceed 300 characters`
  })
});

interface ReportProfileProps {
  profile: Profile | null;
}

const ReportProfile: FC<ReportProfileProps> = ({ profile }) => {
  const [isRadioSelected, setIsRadioSelected] = useState(false);

  const form = useZodForm({
    schema: reportProfileSchema
  });

  return (
    <div className="flex flex-col space-y-2 p-5">
      <Form
        className="space-y-4"
        form={form}
        onSubmit={() => {
          alert('Submitted' + profile?.id);
        }}
      >
        <div className="space-y-5">
          <Radio
            title={t`Misleading Account`}
            value={t`Impersonation or false claims about identity or affiliation`}
            name="reportReason"
            onChange={() => setIsRadioSelected(true)}
          />
          <Radio
            title={t`Frequently Posts Unwanted Content`}
            value={t`Spam; excessive mentions or replies`}
            name="reportReason"
            onChange={() => setIsRadioSelected(true)}
          />
        </div>
        <div className="divider my-5" />
        <div>
          <TextArea
            label={t`Add details to report`}
            placeholder={t`Enter a reason or any other details here...`}
            {...form.register('report')}
          />
        </div>
        <Button
          className="flex w-full justify-center"
          type="submit"
          variant="primary"
          icon={<PencilAltIcon className="h-4 w-4" />}
          disabled={!isRadioSelected}
        >
          <Trans>Report</Trans>
        </Button>
      </Form>
    </div>
  );
};

export default ReportProfile;
