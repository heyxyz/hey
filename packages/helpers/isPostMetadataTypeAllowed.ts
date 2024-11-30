const allowedTypes = [
  "ArticleMetadata",
  "AudioMetadata",
  "ImageMetadata",
  "TextOnlyMetadata",
  "LinkMetadata",
  "VideoMetadata",
  "MintMetadata",
  "LiveStreamMetadata",
  "CheckingInMetadata"
];

const isPostMetadataTypeAllowed = (type?: string): boolean => {
  if (!type) {
    return false;
  }

  return allowedTypes.includes(type);
};

export default isPostMetadataTypeAllowed;
