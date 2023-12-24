import type { CollectCondition as CollectConditionType } from '@hey/lens';
import type { FC } from 'react';

import Link from 'next/link';

interface CollectConditionProps {
  condition: CollectConditionType;
}

const CollectCondition: FC<CollectConditionProps> = ({ condition }) => {
  const { publicationId, thisPublication } = condition;

  return (
    <div className="flex items-center space-x-2">
      <div>
        {thisPublication
          ? 'Must collect this publication'
          : 'Must collect the publication:'}
      </div>
      {!thisPublication ? (
        <div className="linkify">
          <Link className="underline" href={`/posts/${publicationId}`}>
            {publicationId}
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default CollectCondition;
