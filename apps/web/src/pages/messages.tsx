import Messages from '@components/Messages';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { reactionContentTypeConfig, XMTPProvider } from '@xmtp/react-sdk';

import Custom404 from './404';

const contentTypeConfigs = [reactionContentTypeConfig];

const XMTPMessages = () => {
  if (!isFeatureAvailable('messages')) {
    return <Custom404 />;
  }

  return (
    <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
      <Messages />
    </XMTPProvider>
  );
};

export default XMTPMessages;
