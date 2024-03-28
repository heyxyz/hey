import type {
  AnyPublication,
  UnknownOpenActionModuleSettings
} from '@hey/lens';
import type { FC } from 'react';

import { FeatureFlag } from '@hey/data/feature-flags';
import { VerifiedOpenActionModules } from '@hey/data/verified-openaction-modules';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import isFeatureAvailable from '@lib/isFeatureAvailable';

import SwapOpenAction from './UnknownModule/Swap';

interface OpenActionOnBodyProps {
  publication: AnyPublication;
}

const OpenActionOnBody: FC<OpenActionOnBodyProps> = ({ publication }) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication?.mirrorOn
    : publication;

  const module = targetPublication.openActionModules.find(
    (module) => module.contract.address === VerifiedOpenActionModules.Swap
  );

  if (!module) {
    return null;
  }

  return (
    <div className="mt-3">
      {module.contract.address === VerifiedOpenActionModules.Swap &&
        (isFeatureAvailable('swap-oa') ||
          isFeatureAvailable(FeatureFlag.LensTeam)) && (
          <SwapOpenAction
            module={module as UnknownOpenActionModuleSettings}
            publication={targetPublication}
          />
        )}
    </div>
  );
};

export default OpenActionOnBody;
