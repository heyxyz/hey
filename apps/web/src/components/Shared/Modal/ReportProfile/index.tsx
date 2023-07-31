import type { Profile } from '@lenster/lens';
import { Button, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { t } from '@lingui/macro';
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
          <div>
            <TextArea
              label={t`Add details to report`}
              placeholder={t`Enter a reason or any other details here...`}
              {...form.register('report')}
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={!isRadioSelected}
        >
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default ReportProfile;
