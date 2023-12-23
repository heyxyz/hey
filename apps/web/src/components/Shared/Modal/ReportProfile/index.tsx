import UserProfile from '@components/Shared/UserProfile';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PROFILE } from '@hey/data/tracking';
import { type Profile, useReportProfileMutation } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import {
  Button,
  Card,
  EmptyState,
  ErrorMessage,
  Form,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC, useState } from 'react';
import { object, string } from 'zod';

import Reason from './Reason';

const reportReportProfileSchema = object({
  additionalComments: string().max(260, {
    message: 'Additional comments should not exceed 260 characters'
  })
});

interface ReportProfileProps {
  profile: null | Profile;
}

const ReportProfile: FC<ReportProfileProps> = ({ profile }) => {
  const [type, setType] = useState('');
  const [subReason, setSubReason] = useState('');

  const form = useZodForm({
    schema: reportReportProfileSchema
  });

  const [
    createReport,
    { data: submitData, error: submitError, loading: submitLoading }
  ] = useReportProfileMutation({
    onCompleted: () => {
      Leafwatch.track(PROFILE.REPORT, { profile_id: profile?.id });
    }
  });

  const reportProfile = (additionalComments: null | string) => {
    createReport({
      variables: {
        request: {
          additionalComments,
          for: profile?.id,
          reason: {
            [type]: {
              reason: type.replace('Reason', '').toUpperCase(),
              subreason: subReason
            }
          }
        }
      }
    });
  };

  return (
    <div onClick={stopEventPropagation}>
      {submitData?.reportProfile === null ? (
        <EmptyState
          hideCard
          icon={<CheckCircleIcon className="size-14 text-green-500" />}
          message="Profile reported successfully!"
        />
      ) : profile ? (
        <div className="p-5">
          <Card className="p-3">
            <UserProfile profile={profile as Profile} showUserPreview={false} />
          </Card>
          <div className="divider my-5" />
          <Form
            className="space-y-4"
            form={form}
            onSubmit={({ additionalComments }) =>
              reportProfile(additionalComments)
            }
          >
            {submitError ? (
              <ErrorMessage error={submitError} title="Failed to report" />
            ) : null}
            <Reason
              setSubReason={setSubReason}
              setType={setType}
              subReason={subReason}
              type={type}
            />
            {subReason ? (
              <>
                <TextArea
                  label="Description"
                  placeholder="Please provide additional details"
                  {...form.register('additionalComments')}
                />
                <Button
                  className="flex w-full justify-center"
                  disabled={submitLoading}
                  icon={
                    submitLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilSquareIcon className="size-4" />
                    )
                  }
                  type="submit"
                >
                  Report
                </Button>
              </>
            ) : null}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ReportProfile;
