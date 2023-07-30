import { Button, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { t } from '@lingui/macro';
import { type FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { object, string } from 'zod';

const reportSchema = object({
  report: string()
    .min(10, { message: t`Report atleast contain 10 characters` })
    .max(300, { message: t`Report should not exceed 300 characters` })
});

const Report: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [hasText, setHasText] = useState(false);
  const [isRadioSelected, setIsRadioSelected] = useState(false);

  const form = useZodForm({
    schema: reportSchema
  });
  return (
    <div className="flex flex-col space-y-2 p-3">
      <Form
        form={form}
        onSubmit={async ({ report }) => {
          if (hasText) {
            const validationResult = reportSchema.safeParse({
              report: report
            });
            if (!validationResult.success) {
              const errorMessage = validationResult.error?.message;
              if (errorMessage) {
                alert(errorMessage);
                return;
              }
            }
          }

          alert('hi');
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
            onChange={() => setHasText(true)}
          />
        </div>
        <div className="flex justify-center">
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            onClick={() => {
              form.setValue('report', '');
              alert('gm 🚀' + currentProfile?.id);
            }}
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
