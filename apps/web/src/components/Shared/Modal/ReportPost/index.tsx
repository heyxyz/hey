import errorToast from "@helpers/errorToast";
import { Leafwatch } from "@helpers/leafwatch";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Errors } from "@hey/data/errors";
import { POST } from "@hey/data/tracking";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { type PostReportReason, useReportPostMutation } from "@hey/indexer";
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
  additionalComment: string().max(260, {
    message: "Additional comments should not exceed 260 characters"
  })
});

interface ReportPostProps {
  postId: null | string;
}

const ReportPost: FC<ReportPostProps> = ({ postId }) => {
  const { isSuspended } = useAccountStatus();
  const [reason, setReason] = useState("");

  const form = useZodForm({
    schema: newReportPostSchema
  });

  const [
    createReport,
    { data: submitData, error: submitError, loading: submitLoading }
  ] = useReportPostMutation({
    onCompleted: () => {
      Leafwatch.track(POST.REPORT, { postId: postId });
    }
  });

  const reportPost = async ({
    additionalComment
  }: z.infer<typeof newReportPostSchema>) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      return await createReport({
        variables: {
          request: {
            additionalComment,
            post: postId,
            reason: reason as PostReportReason
          }
        }
      });
    } catch (error) {
      errorToast(error);
    }
  };

  return (
    <div onClick={stopEventPropagation}>
      {submitData?.reportPost === null ? (
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
            <Reason setReason={setReason} reason={reason} />
            {reason ? (
              <>
                <TextArea
                  label="Description"
                  placeholder="Please provide additional details"
                  {...form.register("additionalComment")}
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
