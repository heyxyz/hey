import Messages from '@components/Messages';
import isFeatureAvailable from '@lib/isFeatureAvailable';
import { XMTPProvider } from '@xmtp/react-sdk';

import Custom404 from './404';

const XMTPMessages = () => {
  if (!isFeatureAvailable('messages')) {
    return <Custom404 />;
  }

  return (
    <XMTPProvider>
      <Messages />
    </XMTPProvider>
  );
};

export default XMTPMessages;
