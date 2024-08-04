import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import isFeatureAvailable from '@helpers/isFeatureAvailable';
import { FeatureFlag } from '@hey/data/feature-flags';
import getPublicationViewCountById from '@hey/helpers/getPublicationViewCountById';
import isOpenActionAllowed from '@hey/helpers/isOpenActionAllowed';
import { isMirrorPublication } from '@hey/helpers/publicationHelpers';
import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { memo } from 'react';
import { useImpressionsStore } from 'src/store/non-persisted/useImpressionsStore';

import OpenAction from '../OpenAction';
import Collect from '../OpenAction/Collect';
import Comment from './Comment';
import Like from './Like';
import Mod from './Mod';
import ShareMenu from './Share';
import Tip from './Tip';
import Views from './Views';

interface PublicationActionsProps {
  publication: AnyPublication;
  showCount?: boolean;
}

const PublicationActions: FC<PublicationActionsProps> = ({
  publication,
  showCount = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { publicationViews } = useImpressionsStore();
  const hasOpenAction = (targetPublication.openActionModules?.length || 0) > 0;

  const canAct =
    hasOpenAction && isOpenActionAllowed(targetPublication.openActionModules);
  const views = getPublicationViewCountById(
    publicationViews,
    targetPublication.id
  );

  return (
    <span
      className="mt-3 flex w-full flex-wrap items-center justify-between gap-3"
      onClick={stopEventPropagation}
    >
      <span className="flex items-center gap-x-6">
        <Comment publication={targetPublication} showCount={showCount} />
        <ShareMenu publication={publication} showCount={showCount} />
        <Like publication={targetPublication} showCount={showCount} />
        {canAct && !showCount ? (
          <OpenAction publication={targetPublication} />
        ) : null}
        <Tip publication={targetPublication} showCount={showCount} />
        {views > 0 ? <Views showCount={showCount} views={views} /> : null}
        {isFeatureAvailable(FeatureFlag.Gardener) ? (
          <Mod isFullPublication={showCount} publication={targetPublication} />
        ) : null}
      </span>
      {canAct ? <Collect publication={targetPublication} /> : null}
    </span>
  );
};

export default memo(PublicationActions);
