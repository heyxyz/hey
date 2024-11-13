import PostWrapper from "@components/Shared/PostWrapper";
import type { PrimaryPublication } from "@hey/lens";
import type { FC } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import HiddenPost from "./HiddenPost";
import PostAvatar from "./PostAvatar";
import PostBody from "./PostBody";
import PostHeader from "./PostHeader";

interface QuotedPostProps {
  isNew?: boolean;
  publication: PrimaryPublication;
}

const QuotedPost: FC<QuotedPostProps> = ({ isNew = false, publication }) => {
  usePushToImpressions(publication.id);

  return (
    <PostWrapper
      className="cursor-pointer p-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <div className="flex items-center space-x-2">
        <PostAvatar publication={publication} quoted />
        <PostHeader isNew={isNew} publication={publication} quoted />
      </div>
      {publication.isHidden ? (
        <HiddenPost type={publication.__typename} />
      ) : (
        <PostBody publication={publication} quoted showMore />
      )}
    </PostWrapper>
  );
};

export default QuotedPost;
