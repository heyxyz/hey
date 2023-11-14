import { describe, expect, test } from 'vitest';

import getPublicationData from './getPublicationData';

describe('getPublicationData', () => {
  test('should return correct data for ArticleMetadataV3', () => {
    const metadata: any = {
      __typename: 'ArticleMetadataV3',
      content: 'This is an article',
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is an article',
      attachments: expect.any(Array)
    });
  });

  test('should return correct data for TextOnlyMetadataV3', () => {
    const metadata: any = {
      __typename: 'TextOnlyMetadataV3',
      content: 'This is a text-only publication'
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is a text-only publication'
    });
  });

  test('should return correct data for LinkMetadataV3', () => {
    const metadata: any = {
      __typename: 'LinkMetadataV3',
      content: 'This is a link publication'
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is a link publication'
    });
  });

  test('should return correct data for ImageMetadataV3', () => {
    const metadata: any = {
      __typename: 'ImageMetadataV3',
      content: 'This is an image publication',
      asset: { image: { optimized: { uri: 'image-uri' } } },
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is an image publication',
      asset: { uri: 'image-uri', type: 'Image' },
      attachments: expect.any(Array)
    });
  });

  test('should return correct data for AudioMetadataV3', () => {
    const metadata: any = {
      __typename: 'AudioMetadataV3',
      content: 'This is an audio publication',
      asset: {
        audio: { optimized: { uri: 'audio-uri' } },
        cover: { optimized: { uri: 'cover-uri' } },
        artist: 'Artist Name'
      },
      title: 'Audio Title',
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is an audio publication',
      asset: {
        uri: 'audio-uri',
        cover: 'cover-uri',
        artist: 'Artist Name',
        title: 'Audio Title',
        type: 'Audio'
      }
    });
  });

  test('should return correct data for VideoMetadataV3', () => {
    const metadata: any = {
      __typename: 'VideoMetadataV3',
      content: 'This is a video publication',
      asset: {
        video: { optimized: { uri: 'video-uri' } },
        cover: { optimized: { uri: 'cover-uri' } }
      },
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is a video publication',
      asset: { uri: 'video-uri', cover: 'cover-uri', type: 'Video' }
    });
  });

  test('should return correct data for MintMetadataV3', () => {
    const metadata: any = {
      __typename: 'MintMetadataV3',
      content: 'This is a mint publication',
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is a mint publication',
      attachments: expect.any(Array)
    });
  });

  test('should return correct data for EmbedMetadataV3', () => {
    const metadata: any = {
      __typename: 'EmbedMetadataV3',
      content: 'This is an embed publication',
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is an embed publication',
      attachments: expect.any(Array)
    });
  });

  test('should return correct data for LiveStreamMetadataV3', () => {
    const metadata: any = {
      __typename: 'LiveStreamMetadataV3',
      content: 'This is a live stream publication',
      attachments: ['attachment1', 'attachment2']
    };
    const result = getPublicationData(metadata);
    expect(result).toEqual({
      content: 'This is a live stream publication',
      attachments: expect.any(Array)
    });
  });

  test('should return null for unknown metadata __typename', () => {
    const metadata: any = {
      __typename: 'UnknownMetadataType',
      content: 'This is an unknown publication'
    };
    const result = getPublicationData(metadata);
    expect(result).toBeNull();
  });
});
