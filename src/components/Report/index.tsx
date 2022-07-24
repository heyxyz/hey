import { gql, useMutation, useQuery } from '@apollo/client'
import { GridItemEight, GridItemFour, GridLayout } from '@components/GridLayout'
import { POST_QUERY } from '@components/Post'
import SinglePost from '@components/Post/SinglePost'
import SettingsHelper from '@components/Shared/SettingsHelper'
import PostShimmer from '@components/Shared/Shimmer/PostShimmer'
import { Button } from '@components/UI/Button'
import { Card, CardBody } from '@components/UI/Card'
import { EmptyState } from '@components/UI/EmptyState'
import { ErrorMessage } from '@components/UI/ErrorMessage'
import { Form, useZodForm } from '@components/UI/Form'
import { Spinner } from '@components/UI/Spinner'
import { TextArea } from '@components/UI/TextArea'
import Seo from '@components/utils/Seo'
import { PencilAltIcon } from '@heroicons/react/outline'
import { CheckCircleIcon } from '@heroicons/react/solid'
import Logger from '@lib/logger'
import { useRouter } from 'next/router'
import React, { FC, useState } from 'react'
import { APP_NAME, ZERO_ADDRESS } from 'src/constants'
import Custom404 from 'src/pages/404'
import { useAppPersistStore } from 'src/store/app'
import { object, string } from 'zod'

import Reason from './Reason'

export const CREATE_REPORT_PUBLICATION_MUTATION = gql`
  mutation ReportPublication($request: ReportPublicationRequest!) {
    reportPublication(request: $request)
  }
`

const newReportSchema = object({
  additionalComments: string()
    .max(260, {
      message: 'Additional comments should not exceed 260 characters'
    })
    .nullable()
})

const Report: FC = () => {
  const {
    query: { id }
  } = useRouter()
  const [type, setType] = useState<string>('')
  const [subReason, setSubReason] = useState<string>('')
  const { currentUser } = useAppPersistStore()
  const { data, loading, error } = useQuery(POST_QUERY, {
    variables: {
      request: { publicationId: id },
      followRequest: {
        followInfos: {
          followerAddress: currentUser?.ownedBy ?? ZERO_ADDRESS,
          profileId: id?.toString().split('-')[0]
        }
      }
    },
    skip: !id,
    onCompleted() {
      Logger.log(
        '[Query]',
        `Fetched publication details to report Publication:${id}`
      )
    }
  })
  const [
    createReport,
    { data: submitData, loading: submitLoading, error: submitError }
  ] = useMutation(CREATE_REPORT_PUBLICATION_MUTATION)

  const form = useZodForm({
    schema: newReportSchema
  })

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
    })
  }

  if (!currentUser || !id) return <Custom404 />

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
                <PostShimmer />
              ) : !data?.publication ? (
                <ErrorMessage
                  title="Failed to load post"
                  error={{ name: '', message: 'No such publication' }}
                />
              ) : (
                <SinglePost post={data?.publication} />
              )}
              {data?.publication && (
                <Form
                  form={form}
                  className="pt-5 space-y-4"
                  onSubmit={({ additionalComments }) => {
                    reportPublication(additionalComments)
                  }}
                >
                  {submitError && (
                    <ErrorMessage
                      title="Failed to report"
                      error={submitError}
                    />
                  )}
                  <Reason
                    setType={setType}
                    setSubReason={setSubReason}
                    type={type}
                  />
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
                          icon={
                            submitLoading ? (
                              <Spinner size="xs" />
                            ) : (
                              <PencilAltIcon className="w-4 h-4" />
                            )
                          }
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
  )
}

export default Report
