import getEmbed from '@hey/lib/embeds/getEmbed';
import type { SnapshotMetadata } from '@hey/types/embed';
import { type FC } from 'react';

import Snapshot from './Snapshot';

interface EmbedProps {
  embed: string;
}

const Embed: FC<EmbedProps> = ({ embed }) => {
  const embedMetadata = getEmbed([embed]);

  if (!embedMetadata) {
    return null;
  }

  const { provider } = embedMetadata;

  return provider === 'snapshot' ? (
    <Snapshot embedMetadata={embedMetadata as SnapshotMetadata} />
  ) : null;
};

export default Embed;
