import Slug from '@components/Shared/Slug';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ClipboardDocumentIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import { useEventListener, useHuddle01, useRoom } from '@huddle01/react/hooks';
import type { Profile } from '@lenster/lens';
import { useProfilesQuery } from '@lenster/lens';
import getAvatar from '@lenster/lib/getAvatar';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Image } from '@lenster/ui';
import isVerified from '@lib/isVerified';
import { t, Trans } from '@lingui/macro';
import type { Dispatch, FC, SetStateAction } from 'react';
import React from 'react';
import { toast } from 'react-hot-toast';
import { SpacesEvents } from 'src/enums';
import { useSpacesStore } from 'src/store/spaces';

import Dropdown from '../Common/Dropdown';
import SettingsTray from '../Common/SettingsTray';

interface SpacesWindowProps {
  isExpanded?: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}

const SpaceWindowHeader: FC<SpacesWindowProps> = ({
  isExpanded,
  setIsExpanded
}) => {
  const { space, setShowSpacesWindow, spacesPublicationId } = useSpacesStore();

  const { leaveRoom, endRoom } = useRoom();
  const { me } = useHuddle01();

  const { data } = useProfilesQuery({
    variables: {
      request: { ownedBy: [space.host] }
    }
  });

  const hostProfile = data?.profiles?.items?.find(
    (profile) => profile?.ownedBy === space.host
  ) as Profile;

  useEventListener(SpacesEvents.ROOM_ME_LEFT, () => {
    setShowSpacesWindow(false);
  });

  return (
    <div className="border-b border-gray-300 pb-3 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDownIcon
              className="h-5 w-5"
              onClick={() => setIsExpanded((prev) => !prev)}
            />
          ) : (
            <ChevronUpIcon
              className="h-5 w-5"
              onClick={() => setIsExpanded((prev) => !prev)}
            />
          )}
          {!isExpanded && (
            <div className="text-sm font-medium text-gray-900 dark:text-gray-300">
              {space.title}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ClipboardDocumentIcon
            className="h-5 w-5"
            onClick={async (event) => {
              stopEventPropagation(event);
              await navigator.clipboard.writeText(
                `${location.origin}/posts/${spacesPublicationId}`
              );
              toast.success(t`Copied to clipboard!`);
            }}
          />
          <Dropdown triggerChild={<EllipsisVerticalIcon className="h-5 w-5" />}>
            <div className="absolute top-4 z-10 -translate-x-12">
              <SettingsTray />
            </div>
          </Dropdown>

          {isExpanded &&
            (me.role === 'host' ? (
              <button className="text-brand-500 text-sm" onClick={endRoom}>
                <Trans>End Spaces</Trans>
              </button>
            ) : (
              <button className="text-brand-500 text-sm" onClick={leaveRoom}>
                <Trans>Leave room</Trans>
              </button>
            ))}
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="my-1 text-base font-medium text-gray-900 dark:text-gray-200">
            {space.title}
          </div>
          <div className="flex items-center gap-1">
            <Image
              src={getAvatar(hostProfile)}
              className="h-4 w-4 rounded-full bg-violet-500"
            />
            <Slug
              slug={`@${hostProfile.handle}`}
              className="text-sm font-normal"
            />
            <div>
              {isVerified(hostProfile.id) && (
                <CheckBadgeIcon className="text-brand h-4 w-4" />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SpaceWindowHeader;
