const allowedTypes = [
  'ArticleMetadataV3',
  'AudioMetadataV3',
  'ImageMetadataV3',
  'TextOnlyMetadataV3',
  'LinkMetadataV3',
  'VideoMetadataV3',
  'MintMetadataV3',
  'LiveStreamMetadataV3'
];

const isPublicationMetadataTypeAllowed = (type?: string): boolean => {
  if (!type) {
    return false;
  }

  return allowedTypes.includes(type);
};

export default isPublicationMetadataTypeAllowed;
