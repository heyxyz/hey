import Username from '@components/Shared/Username';
import type { MessageDescriptor } from '@generated/types';
import { SwitchHorizontalIcon } from '@heroicons/react/outline';
import { defineMessage } from '@lingui/macro';
import { Trans } from '@lingui/react';
import type { Mirror } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';

interface Props {
  publication: Mirror;
}

const messages: Record<string, MessageDescriptor> = {
  comment: defineMessage({
    id: '<0><1/> mirrored the <2>comment</2></0>'
  }),
  post: defineMessage({
    id: '<0><1/> mirrored the <2>post</2></0>'
  })
};

const defaultMessage = (typeName: string): string => {
  return '<0><1/> mirrored the <2>' + typeName + '</2></0>';
};

const Mirrored: FC<Props> = ({ publication }) => {
  const typeName = publication?.mirrorOf.__typename?.toLowerCase() || '';
  return (
    <div className="lt-text-gray-500 flex items-center space-x-1 pb-4 text-[13px]">
      <SwitchHorizontalIcon className="h-4 w-4" />
      <Trans
        id={messages[typeName]?.id || defaultMessage(typeName)}
        components={[
          <span key="" />,
          <Username profile={publication.profile} className="max-w-xs truncate" key="" />,
          <Link href={`/posts/${publication?.mirrorOf?.id}`} className="font-bold" key="">
            {publication?.mirrorOf.__typename?.toLowerCase()}
          </Link>
        ]}
      />
    </div>
  );
};

export default Mirrored;
