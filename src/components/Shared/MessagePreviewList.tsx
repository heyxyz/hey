import Preview from '@components/Messages/Preview';
import { Card } from '@components/UI/Card';
import { GridItemFour } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { FC } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

const Messages: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { loading, messages, profiles, profilesError } = useMessagePreviews();

  if (!isFeatureEnabled('messages', currentProfile?.id)) {
    return <Custom404 />;
  }

  if (profilesError) {
    return <Custom500 />;
  }

  const showLoading = loading && (messages.size === 0 || profiles.size === 0);

  const sortedProfiles = Array.from(profiles.values()).sort((a, b) => {
    const messageA = messages.get(a.ownedBy.toLowerCase());
    const messageB = messages.get(b.ownedBy.toLowerCase());
    return (messageA?.sent?.getTime() || 0) >= (messageB?.sent?.getTime() || 0) ? -1 : 1;
  });

  return (
    <GridItemFour>
      <Card className="h-[86vh] px-2 pt-3">
        <div className="flex justify-between">
          <div className="font-black text-lg">Messages</div>
          <div>
            <button className="text-xs border border-p-100 p-1 rounded" type="button">
              New Message
            </button>
          </div>
        </div>
        <div className="flex justify-between p-4">
          <div className="text-xs">Lens profiles</div>
          <div className="text-xs">All messages</div>
        </div>
        <div>
          {showLoading ? (
            <PageLoading message="Loading messages" />
          ) : (
            Array.from(sortedProfiles.values()).map((profile, index) => {
              const message = messages.get(profile.ownedBy.toLowerCase());
              if (!message) {
                return null;
              }
              return <Preview key={`${profile.ownedBy}_${index}`} profile={profile} message={message} />;
            })
          )}
        </div>
      </Card>
    </GridItemFour>
  );
};

export default Messages;
