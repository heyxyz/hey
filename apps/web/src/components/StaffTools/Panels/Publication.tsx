import MetaDetails from "@components/Shared/MetaDetails";
import { HashtagIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { isCommentPublication } from "@hey/helpers/publicationHelpers";
import type { MirrorablePublication } from "@hey/lens";
import { Card, H5 } from "@hey/ui";
import type { FC } from "react";
import AIModeration from "./AIModeration";

interface PublicationStaffToolProps {
  publication: MirrorablePublication;
}

const PublicationStaffTool: FC<PublicationStaffToolProps> = ({
  publication
}) => {
  const isComment = isCommentPublication(publication);

  return (
    <Card
      as="aside"
      className="!bg-yellow-300/20 mt-5 border-yellow-400 p-5"
      forceRounded
    >
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="size-5" />
        <H5>Staff tool</H5>
      </div>
      <div className="mt-3 space-y-2">
        <MetaDetails
          icon={<HashtagIcon className="ld-text-gray-500 size-4" />}
          title="Publication ID"
          value={publication?.id}
        >
          {publication?.id}
        </MetaDetails>
        {isComment ? (
          <MetaDetails
            icon={<HashtagIcon className="ld-text-gray-500 size-4" />}
            title="Comment on"
            value={publication?.commentOn?.id}
          >
            {publication?.commentOn?.id}
          </MetaDetails>
        ) : null}
        {publication?.openActionModules?.length ? (
          <MetaDetails
            icon={<ShoppingBagIcon className="ld-text-gray-500 size-4" />}
            noFlex
            title="Open action modules"
          >
            {(publication?.openActionModules || []).map((module) => (
              <div key={module.__typename}>{module.__typename}</div>
            ))}
          </MetaDetails>
        ) : null}
        <AIModeration id={publication?.id} />
      </div>
    </Card>
  );
};

export default PublicationStaffTool;
