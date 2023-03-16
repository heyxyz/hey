import { expect, test } from '@playwright/test';
import getSignature from 'utils/getSignature';

test.describe('getSignature', async () => {
  test('should return an object with domain, types, and value keys', async () => {
    const result = getSignature({
      domain: {},
      types: {},
      value: {}
    });

    await expect(result).toHaveProperty('domain');
    await expect(result).toHaveProperty('types');
    await expect(result).toHaveProperty('value');
  });

  test('should remove __typename property from domain, types, and value properties', async () => {
    const input = {
      domain: { key: 'value', __typename: 'Domain' },
      types: { key: 'value', __typename: 'Types' },
      value: { key: 'value', __typename: 'Value' }
    };
    const result = getSignature(input);

    await expect(result).toEqual({
      domain: { key: 'value' },
      types: { key: 'value' },
      value: { key: 'value' }
    });
  });
});
