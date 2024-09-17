import type { FC } from "react";

import Markup from "@components/Shared/Markup";
import getMentions from "@hey/helpers/getMentions";
import getMisuseDetails from "@hey/helpers/getMisuseDetails";
import { Card } from "@hey/ui";

interface ScamWarningProps {
  profileId: string;
}

const ScamWarning: FC<ScamWarningProps> = ({ profileId }) => {
  const misuseDetails = getMisuseDetails(profileId);

  if (!misuseDetails) {
    return null;
  }

  const { description, identifiedOn, type } = misuseDetails;

  return (
    <Card
      as="aside"
      className="!bg-red-300/20 mb-4 space-y-2.5 border-red-400 p-5 text-red-600"
      forceRounded
    >
      <div className="flex items-center space-x-2 font-bold">
        <p>Profile is marked as {type.toLowerCase()}!</p>
      </div>
      {description && (
        <Markup className="text-sm" mentions={getMentions(description)}>
          {description}
        </Markup>
      )}
      {identifiedOn && (
        <p className="text-sm italic">
          <b>Identified on:</b> {identifiedOn}
        </p>
      )}
    </Card>
  );
};

export default ScamWarning;
