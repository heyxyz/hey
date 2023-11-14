export interface EmbedProviderWithLink {
  provider: 'snapshot';
  embed: string;
}

export interface SnapshotMetadata extends EmbedProviderWithLink {
  space: string;
  proposal: string;
}

export type EmbedMetadata = SnapshotMetadata;
