import type { Profile } from '@lenster/lens';
import getScamDetails from '@lenster/lib/getScamDetails';
import { ErrorMessage } from '@lenster/ui';
import { t } from '@lingui/macro';
import type { FC } from 'react';

interface ScamWarningProps {
  profile: Profile;
}

const ScamWarning: FC<ScamWarningProps> = ({ profile }) => {
  if (!getScamDetails(profile?.id)?.description) {
    return null;
  }

  return (
    <ErrorMessage
      title={t`Profile is marked as scam!`}
      error={{
        name: t`Scam`,
        message: getScamDetails(profile?.id)?.description as string
      }}
    />
  );
};

export default ScamWarning;
