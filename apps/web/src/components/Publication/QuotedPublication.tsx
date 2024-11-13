import PublicationWrapper from "@components/Shared/PublicationWrapper";
import type { PrimaryPublication } from "@hey/lens";
import type { FC } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";
import HiddenPublication from "./HiddenPublication";
import PostAvatar from "./PostAvatar";
import PostHeader from "./PostHeader";
import PublicationBody from "./PublicationBody";

interface QuotedPublicationProps {
  isNew?: boolean;
  publication: PrimaryPublication;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({
  isNew = false,
  publication
}) => {
  usePushToImpressions(publication.id);

  return (
    <PublicationWrapper
      className="cursor-pointer p-4 transition-colors first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <div className="flex items-center space-x-2">
        <PostAvatar publication={publication} quoted />
        <PostHeader isNew={isNew} publication={publication} quoted />
      </div>
      {publication.isHidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} quoted showMore />
      )}
    </PublicationWrapper>
  );
};

export default QuotedPublication;
