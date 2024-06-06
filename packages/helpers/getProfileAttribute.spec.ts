import type { MetadataAttribute } from '@good/lens';

import { MetadataAttributeType } from '@good/lens';
import { describe, expect, test } from 'vitest';

import getProfileAttribute from './getProfileAttribute';

describe('getProfileAttribute', () => {
  test('should return the attribute value from a trait if key is valid', () => {
    const attributes: MetadataAttribute[] = [
      { key: 'x', type: MetadataAttributeType.String, value: '@myx' },
      {
        key: 'location',
        type: MetadataAttributeType.String,
        value: 'New York'
      },
      {
        key: 'website',
        type: MetadataAttributeType.String,
        value: 'https://www.example.com'
      }
    ];
    expect(getProfileAttribute('location', attributes)).toEqual('New York');
  });

  test('should return an empty string when attributes are undefined', () => {
    const attributes = undefined;
    expect(getProfileAttribute('location', attributes)).toEqual('');
  });
});
