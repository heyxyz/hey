import { describe, expect, test } from 'vitest';

import getMentions from './getMentions';

describe('getAttachmentsData', () => {
  test('should return an empty array for text without mentions', () => {
    const text = 'This is a test message';
    const result = getMentions(text);
    expect(result).toEqual([]);
  });

  test('should return an array with a single mention', () => {
    const text = 'Hey @lens/johnsmith! How are you?';
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: 'lens/johnsmith',
          localName: 'johnsmith'
        },
        stillOwnsHandle: true
      }
    ]);
  });

  test('should return an array with multiple mentions', () => {
    const text = 'Hello @lens/john, @hey/jane, and @tape/doe!';
    const result = getMentions(text);
    expect(result).toEqual([
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: 'lens/john',
          localName: 'john'
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: 'hey/jane',
          localName: 'jane'
        },
        stillOwnsHandle: true
      },
      {
        profile: {},
        snapshotHandleMentioned: {
          fullHandle: 'tape/doe',
          localName: 'doe'
        },
        stillOwnsHandle: true
      }
    ]);
  });
});
