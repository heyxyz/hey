import Action from "@components/Post/OpenAction/TipAction/Action";
import { APP_NAME, HEY_TIP_POST } from "@hey/data/constants";
import { type Post, type PostRequest, usePostQuery } from "@hey/indexer";
import { ErrorMessage, H4 } from "@hey/ui";
import type { FC } from "react";
import Loader from "../Loader";

interface TipHeyProps {
  onTip: () => void;
}

const TipHey: FC<TipHeyProps> = ({ onTip }) => {
  const request: PostRequest = { post: HEY_TIP_POST };
  const { data, error, loading } = usePostQuery({
    variables: { request }
  });

  if (loading) {
    return <Loader className="my-10" />;
  }

  if (error) {
    return <ErrorMessage className="m-5" error={error} title="Failed to Tip" />;
  }

  return (
    <>
      <div className="m-5 space-y-5">
        <div className="space-y-2">
          <H4>Support {APP_NAME}</H4>
          <div className="ld-text-gray-500 text-sm">
            Support the growth and development of {APP_NAME} by giving a tip.
          </div>
        </div>
      </div>
      <div className="divider" />
      <Action post={data?.post as Post} closePopover={onTip} />
    </>
  );
};

export default TipHey;
