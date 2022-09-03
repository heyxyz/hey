import { gql, useMutation, useQuery } from '@apollo/client';
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout';
import { PUBLICATION_QUERY } from '@components/Publication';
import SinglePublication from '@components/Publication/SinglePublication';
import SettingsHelper from '@components/Shared/SettingsHelper';
import PublicationShimmer from '@components/Shared/Shimmer/PublicationShimmer';
import { Button } from '@components/UI/Button';
import { Card, CardBody } from '@components/UI/Card';
import { EmptyState } from '@components/UI/EmptyState';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import { Form, useZodForm } from '@components/UI/Form';
import { Spinner } from '@components/UI/Spinner';
import { TextArea } from '@components/UI/TextArea';
import Seo from '@components/utils/Seo';
import { PencilAltIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { Hog } from '@lib/hog';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useState } from 'react';
import { APP_NAME, ZERO_ADDRESS } from 'src/constants';
import Custom404 from 'src/pages/404';
import { useAppStore } from 'src/store/app';
import { PAGEVIEW, PUBLICATION } from 'src/tracking';
import { object, string } from 'zod';

import Reason from './Reason';

export const CREATE_REPORT_PUBLICATION_MUTATION = gql`
  mutation ReportPublication($request: ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`;

const newReportSchema = object({
  additionalComments: string().max(260, {
    message: 'Additional comments should not exceed 260 characters'
  })
});

const Report: FC = () => {
  const {
    query: { id }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [type, setType] = useState('');
  const [subReason, setSubReason] = useState('');

  useEffect(() => {
    Hog.track('Pageview', { path: PAGEVIEW.REPORT });
  }, []);

  const { data, loading, error } = useQuery(PUBLICATION_QUERY, {
    variables: {
      request: { publicationId: id },
      followRequest: {
        followInfos: {
          followerAddress: currentProfile?.ownedBy ?? ZERO_ADDRESS,
          profileId: id?.toString().split('-')[0]
        }
      }
    },
    skip: !id
  });
  const [createReport, { data: submitData, loading: submitLoading, error: submitError }] = useMutation(
    CREATE_REPORT_PUBLICATION_MUTATION,
    {
      onCompleted: () => {
        Hog.track(PUBLICATION.REPORT);
      }
    }
  );

  const form = useZodForm({
    schema: newReportSchema
  });

  const reportPublication = (additionalComments: string | null) => {
    createReport({
      variables: {
        request: {
          publicationId: data?.publication?.id,
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

  if (!currentProfile || !id) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <Seo title={`Report • ${APP_NAME}`} />
      <GridItemFour>
        <SettingsHelper
          heading="Report publication"
          description="Help us understand the problem. What is going on with this publication?"
        />
      </GridItemFour>
      <GridItemEight>
        <Card>
          {submitData?.reportPublication === null ? (
            <EmptyState
              message={<span>Publication reported successfully!</span>}
              icon={<CheckCircleIcon className="w-14 h-14 text-green-500" />}
              hideCard
            />
          ) : (
            <CardBody>
              <ErrorMessage title="Failed to load post" error={error} />
              {loading ? (
                <PublicationShimmer />
              ) : !data?.publication ? (
                <ErrorMessage
                  title="Failed to load post"
                  error={{ name: '', message: 'No such publication' }}
                />
              ) : (
                <Card>
                  <SinglePublication publication={data?.publication} />
                </Card>
              )}
              {data?.publication && (
                <Form
                  form={form}
                  className="pt-5 space-y-4"
                  onSubmit={({ additionalComments }) => {
                    reportPublication(additionalComments);
                  }}
                >
                  {submitError && <ErrorMessage title="Failed to report" error={submitError} />}
                  <Reason setType={setType} setSubReason={setSubReason} type={type} />
                  {subReason && (
                    <>
                      <TextArea
                        label="Description"
                        placeholder="Tell us something about the community!"
                        {...form.register('additionalComments')}
                      />
                      <div className="ml-auto">
                        <Button
                          type="submit"
                          disabled={submitLoading}
                          icon={submitLoading ? <Spinner size="xs" /> : <PencilAltIcon className="w-4 h-4" />}
                        >
                          Report
                        </Button>
                      </div>
                    </>
                  )}
                </Form>
              )}
            </CardBody>
          )}
        </Card>
      </GridItemEight>
    </GridLayout>
  );
};

export default Report;
