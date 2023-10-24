import { type MetadataAttribute, MetadataAttributeType } from '@hey/lens';
import { describe, expect, test } from 'vitest';

import getProfileAttribute from './getProfileAttribute';

describe('getProfileAttribute', () => {
  test('should return the attribute value from a trait if key is valid', () => {
    const attributes: MetadataAttribute[] = [
      { key: 'x', value: '@myx', type: MetadataAttributeType.String },
      {
        key: 'location',
        value: 'New York',
        type: MetadataAttributeType.String
      },
      {
        key: 'website',
        value: 'https://www.example.com',
        type: MetadataAttributeType.String
      }
    ];
    expect(getProfileAttribute(attributes, 'location')).toEqual('New York');
  });

  test('should return an empty string when attributes are undefined', () => {
    const attributes = undefined;
    expect(getProfileAttribute(attributes, 'location')).toEqual('');
  });
});
