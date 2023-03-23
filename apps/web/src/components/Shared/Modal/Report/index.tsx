import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Mixpanel } from '@lib/mixpanel';
import { stopEventPropagation } from '@lib/stopEventPropagation';
import { t, Trans } from '@lingui/macro';
import type { Publication } from 'lens';
import { useReportPublicationMutation } from 'lens';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { useGlobalModalStateStore } from 'src/store/modals';
import { PAGEVIEW, PUBLICATION } from 'src/tracking';
import { Button, EmptyState, ErrorMessage, Form, Spinner, TextArea, useZodForm } from 'ui';
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

  useEffect(() => {
    Mixpanel.track(PAGEVIEW, { page: 'report' });
  }, []);

  const [createReport, { data: submitData, loading: submitLoading, error: submitError }] =
    useReportPublicationMutation({
      onCompleted: () => {
        Mixpanel.track(PUBLICATION.REPORT, {
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
    <div onClick={stopEventPropagation}>
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
            {submitError && <ErrorMessage title={t`Failed to report`} error={submitError} />}
            <Reason setType={setType} setSubReason={setSubReason} type={type} subReason={subReason} />
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
                    icon={submitLoading ? <Spinner size="xs" /> : <PencilAltIcon className="h-4 w-4" />}
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
