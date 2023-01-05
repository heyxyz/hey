import { Card } from '@components/UI/Card';
import { ChatAlt2Icon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import type { FC } from 'react';

const CommentWarning: FC = () => {
  return (
    <Card className="!bg-blue-100 border-blue-300 flex items-center space-x-1.5 text-sm font-bold lt-text-gray-500 p-5">
      <ChatAlt2Icon className="w-4 h-4 text-blue-500" />
      <span>
        <Trans>You can't reply to this post</Trans>
      </span>
    </Card>
  );
};

export default CommentWarning;
