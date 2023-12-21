import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { PUBLICATION } from '@hey/data/tracking';
import { useReportPublicationMutation } from '@hey/lens';
import stopEventPropagation from '@hey/lib/stopEventPropagation';
import {
  Button,
  EmptyState,
  ErrorMessage,
  Form,
  Spinner,
  TextArea,
  useZodForm
} from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import { object, string } from 'zod';

import Reason from './Reason';

const newReportPublicationSchema = object({
  additionalComments: string().max(260, {
    message: 'Additional comments should not exceed 260 characters'
  })
});

interface ReportProps {
  publication: AnyPublication | null;
}

const ReportPublication: FC<ReportProps> = ({ publication }) => {
  const [type, setType] = useState('');
  const [subReason, setSubReason] = useState('');

  const form = useZodForm({
    schema: newReportPublicationSchema
  });

  const [
    createReport,
    { data: submitData, error: submitError, loading: submitLoading }
  ] = useReportPublicationMutation({
    onCompleted: () => {
      Leafwatch.track(PUBLICATION.REPORT, {
        publication_id: publication?.id
      });
    }
  });

  const reportPublication = (additionalComments: null | string) => {
    createReport({
      variables: {
        request: {
          additionalComments,
          for: publication?.id,
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
      {submitData?.reportPublication === null ? (
        <EmptyState
          hideCard
          icon={<CheckCircleIcon className="size-14 text-green-500" />}
          message="Publication reported successfully!"
        />
      ) : publication ? (
        <div className="p-5">
          <Form
            className="space-y-4"
            form={form}
            onSubmit={({ additionalComments }) =>
              reportPublication(additionalComments)
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

export default ReportPublication;
