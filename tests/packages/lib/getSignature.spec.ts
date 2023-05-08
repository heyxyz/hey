import { expect, test } from '@playwright/test';
import getSignature from 'lib/getSignature';

test.describe('getSignature', () => {
  test('should return an object with domain, types, and value keys', () => {
    const result = getSignature({
      domain: {},
      types: {
        Post: []
      },
      value: {}
    });

    expect(result).toHaveProperty('domain');
    expect(result).toHaveProperty('types');
    expect(result).toHaveProperty('message');
    expect(result.primaryType).toEqual('Post');
  });

  test('should remove __typename property from domain, types, and value properties', () => {
    const input = {
      domain: { key: 'value', __typename: 'Domain' },
      types: { key: 'value', __typename: 'Types' },
      value: { key: 'value', __typename: 'Value' }
    };
    const result = getSignature(input);

    expect(result).toEqual({
      primaryType: 'key',
      domain: { key: 'value' },
      types: { key: 'value' },
      message: { key: 'value' }
    });
  });
});
