import type { FC } from 'react';

import Markup from '@components/Shared/Markup';
import getMentions from '@hey/helpers/getMentions';
import getMisuseDetails from '@hey/helpers/getMisuseDetails';
import { Card } from '@hey/ui';

interface ScamWarningProps {
  profileId: string;
}

const ScamWarning: FC<ScamWarningProps> = ({ profileId }) => {
  const misuseDetails = getMisuseDetails(profileId);

  if (!misuseDetails) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-2.5 border-red-400 !bg-red-300/20 p-5 text-red-600"
      forceRounded
    >
      <div className="flex items-center space-x-2 font-bold">
        <p>Profile is marked as {misuseDetails.type.toLowerCase()}!</p>
      </div>
      {misuseDetails?.description ? (
        <Markup
          className="text-sm"
          mentions={getMentions(misuseDetails?.description)}
        >
          {misuseDetails?.description}
        </Markup>
      ) : null}
      {misuseDetails?.identifiedOn ? (
        <p className="text-sm italic">
          <b>Identified on:</b> {misuseDetails?.identifiedOn}
        </p>
      ) : null}
    </Card>
  );
};

export default ScamWarning;
