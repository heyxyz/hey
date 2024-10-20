import getPublicationData from "@hey/helpers/getPublicationData";
import { isMirrorPublication } from "@hey/helpers/publicationHelpers";
import type { AnyPublication } from "@hey/lens";
import type { FC } from "react";
import { memo } from "react";
import usePushToImpressions from "src/hooks/usePushToImpressions";

interface SingleImagePublicationProps {
  publication: AnyPublication;
}

const SingleImagePublication: FC<SingleImagePublicationProps> = ({
  publication
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const filteredAttachments =
    getPublicationData(targetPublication.metadata)?.attachments || [];
  const filteredAsset = getPublicationData(targetPublication.metadata)?.asset;

  usePushToImpressions(targetPublication.id);

  const backgroundImage = filteredAsset?.uri || filteredAttachments[0]?.uri;

  return (
    <div
      key={publication.id}
      className="relative h-80 overflow-hidden rounded-lg bg-center bg-cover"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        borderRadius: "16px"
      }}
    >
      <div
        className="absolute inset-0 bg-black opacity-50"
        style={{ borderRadius: "inherit" }}
      />
      <div className="relative z-10 flex h-full items-end justify-start p-4">
        <h1 className="font-bold text-white">Your Text Here</h1>
      </div>
    </div>
  );
};

export default memo(SingleImagePublication);
