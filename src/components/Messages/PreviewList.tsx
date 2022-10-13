import Preview from '@components/Messages/Preview';
import { Card } from '@components/UI/Card';
import { GridItemFour } from '@components/UI/GridLayout';
import { PageLoading } from '@components/UI/PageLoading';
import useMessagePreviews from '@components/utils/hooks/useMessagePreviews';
import { PlusCircleIcon } from '@heroicons/react/outline';
import isFeatureEnabled from '@lib/isFeatureEnabled';
import type { FC } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { useAppStore } from 'src/store/app';

const PreviewList: FC = () => {
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
      <Card className="h-[86vh]">
        <div className="flex justify-between items-center p-5 border-b">
          <div className="font-bold">Messages</div>
          <button>
            <PlusCircleIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mt-2">
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

export default PreviewList;
