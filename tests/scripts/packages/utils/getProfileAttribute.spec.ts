import { expect, test } from '@playwright/test';
import type { Attribute } from 'lens';
import getProfileAttribute from 'utils/getProfileAttribute';

test.describe('getProfileAttribute', async () => {
  test('should return the attribute value from a trait if key is valid', () => {
    const attributes: Attribute[] = [
      { key: 'hasPrideLogo', value: 'true' },
      { key: 'app', value: 'Lenster' },
      { key: 'twitter', value: '@mytwitter' },
      { key: 'location', value: 'New York' },
      { key: 'website', value: 'https://www.example.com' },
      { key: 'statusEmoji', value: '👋' },
      { key: 'statusMessage', value: 'Hello World!' }
    ];
    expect(getProfileAttribute(attributes, 'app')).toEqual('Lenster');
  });

  test('should return an empty string when attributes are undefined', () => {
    const attributes = undefined;
    expect(getProfileAttribute(attributes, 'app')).toEqual('');
  });

  test('should return an empty string when attributes are undefined', () => {
    const attributes = undefined;
    expect(getProfileAttribute(attributes, 'app')).toEqual('');
  });
});
