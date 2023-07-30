import { Button, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useState } from 'react';
import { object, string } from 'zod';

const reportProfileSchema = object({
  report: string().max(300, {
    message: t`Report should not exceed 300 characters`
  })
});

const Report: FC = () => {
  const [isRadioSelected, setIsRadioSelected] = useState(false);

  const form = useZodForm({
    schema: reportProfileSchema
  });

  return (
    <div className="flex flex-col space-y-2 p-3">
      <Form
        form={form}
        onSubmit={async ({}) => {
          alert('Submitted');
        }}
      >
        <div className="space-y-2">
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

        <div className="flex flex-col p-2">
          <TextArea
            label={t`Add details to report`}
            placeholder={t`Enter a reason or any other details here...`}
            {...form.register('report')}
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={!isRadioSelected}
          >
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Report;
