import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { useReportPublicationMutation } from "@hey/lens";
import {
  Button,
  EmptyState,
  ErrorMessage,
  Form,
  TextArea,
  useZodForm
} from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAccountStatus } from "src/store/non-persisted/useAccountStatus";
import { object, string, type z } from "zod";
import Reason from "./Reason";

const newReportPostSchema = object({
  additionalComments: string().max(260, {
    message: "Additional comments should not exceed 260 characters"
  })
});

interface ReportPostProps {
  postId: null | string;
}

const ReportPost: FC<ReportPostProps> = ({ postId }) => {
  const { isSuspended } = useAccountStatus();
  const [type, setType] = useState("");
  const [subReason, setSubReason] = useState("");

  const form = useZodForm({
    schema: newReportPostSchema
  });

  const [
    createReport,
    { data: submitData, error: submitError, loading: submitLoading }
  ] = useReportPublicationMutation({
    onCompleted: () => {
      Leafwatch.track(POST.REPORT, { postId: postId });
    }
  });

  const reportPost = async ({
    additionalComments
  }: z.infer<typeof newReportPostSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      return await createReport({
        variables: {
          request: {
            additionalComments,
            for: postId,
            reason: {
              [type]: {
                reason: type.replace("Reason", "").toUpperCase(),
                subreason: subReason
              }
            }
          }
        }
      });
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div onClick={stopEventPropagation}>
      {submitData?.reportPublication === null ? (
        <EmptyState
          hideCard
          icon={<CheckCircleIcon className="size-14" />}
          message="Publication reported"
        />
      ) : postId ? (
        <div className="p-5">
          <Form className="space-y-4" form={form} onSubmit={reportPost}>
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
                  {...form.register("additionalComments")}
                />
                <Button
                  className="flex w-full justify-center"
                  disabled={submitLoading}
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

export default ReportPost;
