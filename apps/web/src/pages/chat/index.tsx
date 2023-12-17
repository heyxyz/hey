import ChatsView from '@components/Chat/ChatsView';
import MetaTags from '@components/Common/MetaTags';
import Loader from '@components/Shared/Loader';
import NotLoggedIn from '@components/Shared/NotLoggedIn';
import { APP_NAME } from '@hey/data/constants';
import { useInitializedClient } from 'src/hooks/useInitializedClient';
import useProfileStore from 'src/store/persisted/useProfileStore';

const ChatPage = () => {
  const currentProfile = useProfileStore((state) => state.currentProfile);

  const { client, isLoading } = useInitializedClient();

  if (!currentProfile) {
    return <NotLoggedIn />;
  }

  if (!client || isLoading) {
    return (
      <div className="page-center flex-col">
        <Loader message="Creating Chat profile..." />
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <MetaTags title={`Chat • ${APP_NAME}`} />
      <ChatsView />
    </div>
  );
};

export default ChatPage;
// export default ChatPage;
