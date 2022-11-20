import { Card } from '@components/UI/Card';
import type { LensterPublication } from '@generated/types';
import { CollectionIcon, GlobeAltIcon, HashtagIcon, LinkIcon } from '@heroicons/react/outline';
import { ShieldCheckIcon } from '@heroicons/react/solid';
import getIPFSLink from '@lib/getIPFSLink';
import type { FC } from 'react';

import MetaDetails from './MetaDetails';

interface Props {
  publication: LensterPublication;
}

const PublicationStaffTool: FC<Props> = ({ publication }) => {
  return (
    <Card as="aside" className="mt-5 border-yellow-400 !bg-yellow-300 !bg-opacity-20 p-5">
      <div className="flex items-center space-x-2 text-yellow-600">
        <ShieldCheckIcon className="h-5 w-5" />
        <div className="text-lg font-bold">Staff tool</div>
      </div>
      <div className="mt-3 space-y-1.5">
        <MetaDetails
          icon={<HashtagIcon className="w-4 h-4 text-gray-500" />}
          value={publication?.id}
          title="Publication ID"
        >
          {publication?.id}
        </MetaDetails>
        {publication?.commentOn?.id ? (
          <MetaDetails
            icon={<HashtagIcon className="w-4 h-4 text-gray-500" />}
            value={publication?.commentOn?.id}
            title="Parent ID"
          >
            {publication?.commentOn?.id}
          </MetaDetails>
        ) : null}
        <MetaDetails
          icon={<CollectionIcon className="w-4 h-4 text-gray-500" />}
          value={publication?.commentOn?.id}
          title="Collect module"
        >
          {publication?.collectModule?.type}
        </MetaDetails>
        <MetaDetails
          icon={<GlobeAltIcon className="w-4 h-4 text-gray-500" />}
          value={publication?.id}
          title="Posted via"
        >
          {publication?.appId}
        </MetaDetails>
        <MetaDetails
          icon={<LinkIcon className="w-4 h-4 text-gray-500" />}
          value={getIPFSLink(publication?.onChainContentURI)}
          title="On-chain content URI"
        >
          <a href={getIPFSLink(publication?.onChainContentURI)} target="_blank" rel="noreferrer">
            Open
          </a>
        </MetaDetails>
      </div>
    </Card>
  );
};

export default PublicationStaffTool;
