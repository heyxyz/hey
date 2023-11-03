import type { PublicationMetadataMedia } from '@hey/lens';
import { describe, expect, test } from 'vitest';

import getAttachmentsData from './getAttachmentsData';

describe('getAttachmentsData', () => {
  test('should return an empty array when attachments are not provided', () => {
    const result = getAttachmentsData();
    expect(result).toEqual([]);
  });

  test('should return an array of image attachments', () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: 'PublicationMetadataMediaImage',
        image: { raw: { uri: 'raw-uri' }, optimized: { uri: 'image-uri' } }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([{ uri: 'image-uri', type: 'Image' }]);
  });

  test('should return an array of video attachments', () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: 'PublicationMetadataMediaVideo',
        video: {
          raw: { uri: 'raw-video-uri' },
          optimized: { uri: 'video-uri' }
        },
        cover: {
          raw: { uri: 'raw-cover-uri' },
          optimized: { uri: 'cover-uri' }
        }
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      { uri: 'video-uri', coverUri: 'cover-uri', type: 'Video' }
    ]);
  });

  test('should return an array of audio attachments', () => {
    const attachments: PublicationMetadataMedia[] = [
      {
        __typename: 'PublicationMetadataMediaAudio',
        audio: {
          raw: { uri: 'raw-audio-uri' },
          optimized: { uri: 'audio-uri' }
        },
        cover: {
          raw: { uri: 'raw-video-uri' },
          optimized: { uri: 'cover-uri' }
        },
        artist: 'John Doe'
      }
    ];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([
      {
        uri: 'audio-uri',
        coverUri: 'cover-uri',
        artist: 'John Doe',
        type: 'Audio'
      }
    ]);
  });

  test('should return an empty array for unknown attachment types', () => {
    const attachments: any[] = [{ __typename: 'UnknownAttachmentType' }];
    const result = getAttachmentsData(attachments);
    expect(result).toEqual([[]]);
  });
});
