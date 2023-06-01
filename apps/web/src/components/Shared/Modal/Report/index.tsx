import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
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
import { useGlobalModalStateStore } from 'src/store/modals';
import { PAGEVIEW, PUBLICATION } from 'src/tracking';
import { useEffectOnce } from 'usehooks-ts';
import { object, string } from 'zod';

import Reason from './Reason';

const newReportSchema = object({
  additionalComments: string().max(260, {
    message: t`Additional comments should not exceed 260 characters`
  })
});

interface ReportProps {
  publication: Publication;
}

const Report: FC<ReportProps> = ({ publication }) => {
  const reportConfig = useGlobalModalStateStore((state) => state.reportConfig);
  const [type, setType] = useState(reportConfig?.type ?? '');
  const [subReason, setSubReason] = useState(reportConfig?.subReason ?? '');

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
    schema: newReportSchema
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
                <div className="ml-auto">
                  <Button
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
                </div>
              </>
            )}
          </Form>
        </div>
      ) : null}
    </div>
  );
};

export default Report;
