import UserProfile from '@components/Shared/UserProfile';
import { PencilAltIcon } from '@heroicons/react/outline';
import { PROFILE } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import { Button, Card, Form, Radio, TextArea, useZodForm } from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import { type FC } from 'react';
import toast from 'react-hot-toast';
import { useGlobalModalStateStore } from 'src/store/modals';
import { object, string, z } from 'zod';

const ReportType = z.enum(['MISLEADING_ACCOUNT', 'UNWANTED_CONTENT']);

const reportReportProfileSchema = object({
  type: ReportType,
  description: string()
    .max(300, {
      message: t`Report should not exceed 300 characters`
    })
    .optional()
});

interface ReportProfileProps {
  profile: Profile | null;
}

const ReportProfile: FC<ReportProfileProps> = ({ profile }) => {
  const setShowReportProfileModal = useGlobalModalStateStore(
    (state) => state.setShowReportProfileModal
  );

  const form = useZodForm({
    schema: reportReportProfileSchema
  });

  return (
    <div className="flex flex-col space-y-2 p-5">
      <Form
        className="space-y-4"
        form={form}
        onSubmit={() => {
          const data = form.getValues();
          const { type, description } = data;
          Leafwatch.track(PROFILE.REPORT_PROFILE, {
            type,
            ...(description && { description }),
            profile: profile?.id
          });
          setShowReportProfileModal(false, null);
          toast.success(t`Reported Successfully!`);
        }}
      >
        {profile ? (
          <Card className="p-3">
            <UserProfile profile={profile as Profile} showUserPreview={false} />
          </Card>
        ) : null}

        <div className="space-y-5">
          <Radio
            heading={
              <span className="font-medium">
                <Trans>Misleading Account</Trans>
              </span>
            }
            description={t`Impersonation or false claims about identity or affiliation`}
            value={ReportType.Enum.MISLEADING_ACCOUNT}
            {...form.register('type')}
            checked={form.watch('type') === ReportType.Enum.MISLEADING_ACCOUNT}
            onChange={() => {
              form.setValue('type', ReportType.Enum.MISLEADING_ACCOUNT);
            }}
          />
          <Radio
            heading={
              <span className="font-medium">
                <Trans>Frequently Posts Unwanted Content</Trans>
              </span>
            }
            description={t`Spam; excessive mentions or replies`}
            value={ReportType.Enum.UNWANTED_CONTENT}
            {...form.register('type')}
            checked={form.watch('type') === ReportType.Enum.UNWANTED_CONTENT}
            onChange={() => {
              form.setValue('type', ReportType.Enum.UNWANTED_CONTENT);
            }}
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
          disabled={!form.watch('type')}
        >
          <Trans>Report</Trans>
        </Button>
      </Form>
    </div>
  );
};

export default ReportProfile;
