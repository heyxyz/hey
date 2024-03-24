import Messages from '@components/Messages';
import { reactionContentTypeConfig, XMTPProvider } from '@xmtp/react-sdk';

const contentTypeConfigs = [reactionContentTypeConfig];

const XMTPMessages = () => {
  return (
    <XMTPProvider contentTypeConfigs={contentTypeConfigs}>
      <Messages />
    </XMTPProvider>
  );
};

export default XMTPMessages;
