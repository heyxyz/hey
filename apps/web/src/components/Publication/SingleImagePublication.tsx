import SmallSingleProfile from "@components/Shared/SmallSingleProfile";
import getPostData from "@hey/helpers/getPostData";
import { isRepost } from "@hey/helpers/postHelpers";
import type { AnyPublication } from "@hey/lens";
import Link from "next/link";
import type { FC } from "react";
import { memo } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";

interface SingleImagePublicationProps {
  publication: AnyPublication;
}

const SingleImagePublication: FC<SingleImagePublicationProps> = ({
  publication
}) => {
  const targetPost = isRepost(publication) ? publication.mirrorOn : publication;
  const filteredAttachments =
    getPostData(targetPost.metadata)?.attachments || [];
  const filteredAsset = getPostData(targetPost.metadata)?.asset;
  const backgroundImage = filteredAsset?.uri || filteredAttachments[0]?.uri;

  usePushToImpressions(targetPost.id);

  return (
    <Link
      href={`/posts/${publication.id}`}
      key={publication.id}
      className="relative h-80 overflow-hidden rounded-xl bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImage})`
      }}
    >
      <div className="absolute inset-0 rounded-lg bg-black opacity-30" />
      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 font-bold text-sm text-white">
        <SmallSingleProfile profile={targetPost.by} hideSlug />
      </div>
    </Link>
  );
};

export default memo(SingleImagePublication);
