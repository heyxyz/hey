import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { PAGEVIEW, PUBLICATION } from '@lenster/data/tracking';
import type { Publication } from '@lenster/lens';
import { useReportPublicationMutation } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import {
  Button,
  EmptyState,
  ErrorMessage,
  Form,
  Spinner,
  TextArea,
  useZodForm
} from '@lenster/ui';
import { Leafwatch } from '@lib/leafwatch';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';
import { useState } from 'react';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

import Reason from './Reason';

const newReportPublicationSchema = object({
  additionalComments: string().max(260, {
    message: t`Additional comments should not exceed 260 characters`
  })
});

interface ReportProps {
  publication: Publication | null;
}

const ReportPublication: FC<ReportProps> = ({ publication }) => {
  const [type, setType] = useState('');
  const [subReason, setSubReason] = useState('');

  useEffectOnce(() => {
    Leafwatch.track(PAGEVIEW, { page: 'report' });
  });

  const [
    createReport,
    { data: submitData, loading: submitLoading, error: submitError }
  ] = useReportPublicationMutation({
    onCompleted: () => {
      Leafwatch.track(PUBLICATION.REPORT, {
        report_publication_id: publication?.id
      });
    }
  });

  const form = useZodForm({
    schema: newReportPublicationSchema
  });

  const reportPublication = (additionalComments: string | null) => {
    createReport({
      variables: {
        request: {
          publicationId: publication?.id,
          reason: {
            [type]: {
              reason: type.replace('Reason', '').toUpperCase(),
              subreason: subReason
            }
          },
          additionalComments
        }
      }
    });
  };

  return (
    <div onClick={stopEventPropagation} aria-hidden="true">
      {submitData?.reportPublication === null ? (
        <EmptyState
          message={t`Publication reported successfully!`}
          icon={<CheckCircleIcon className="h-14 w-14 text-green-500" />}
          hideCard
        />
      ) : publication ? (
        <div className="p-5">
          <Form
            form={form}
            className="space-y-4"
            onSubmit={({ additionalComments }) => {
              reportPublication(additionalComments);
            }}
          >
            {submitError && (
              <ErrorMessage title={t`Failed to report`} error={submitError} />
            )}
            <Reason
              setType={setType}
              setSubReason={setSubReason}
              type={type}
              subReason={subReason}
            />
            {subReason && (
              <>
                <TextArea
                  label={t`Description`}
                  placeholder={t`Please provide additional details`}
                  {...form.register('additionalComments')}
                />
                <Button
                  className="flex w-full justify-center"
                  type="submit"
                  disabled={submitLoading}
                  icon={
                    submitLoading ? (
                      <Spinner size="xs" />
                    ) : (
                      <PencilAltIcon className="h-4 w-4" />
                    )
                  }
                >
                  <Trans>Report</Trans>
                </Button>
              </>
            )}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default ReportPublication;
