import type { Profile } from '@lenster/lens';
import getMisuseDetails from '@lenster/lib/getMisuseDetails';
import { Card } from '@lenster/ui';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

interface ScamWarningProps {
  profile: Profile;
}

const ScamWarning: FC<ScamWarningProps> = ({ profile }) => {
  const misuseDetails = getMisuseDetails(profile?.id);

  if (!misuseDetails) {
    return null;
  }

  return (
    <Card
      as="aside"
      className="mb-4 space-y-2.5 border-red-400 !bg-red-300/20 p-5 text-red-600"
    >
      <div className="flex items-center space-x-2 font-bold">
        <p>
          <Trans>
            Profile is marked as {misuseDetails.type.toLowerCase()}!
          </Trans>
        </p>
      </div>
      {misuseDetails?.description ? (
        <p className="text-sm">{misuseDetails?.description}</p>
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
