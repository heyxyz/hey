import type { MetadataAttribute } from '@hey/lens';
import { describe, expect, test } from 'vitest';

import getPublicationAttribute from './getPublicationAttribute';

describe('getPublicationAttribute', () => {
  const attributes: MetadataAttribute[] = [
    { key: 'type', value: 'book' },
    { key: 'author', value: 'John Doe' },
    { key: 'year', value: '2021' }
  ];

  test('should return empty string if attributes is undefined', () => {
    expect(getPublicationAttribute(undefined, 'type')).toBe('');
  });

  test('should return empty string if traitType is not found in attributes', () => {
    expect(getPublicationAttribute(attributes, 'title')).toBe('');
  });

  test('should return the value of the matching traitType', () => {
    expect(getPublicationAttribute(attributes, 'author')).toBe('John Doe');
    expect(getPublicationAttribute(attributes, 'year')).toBe('2021');
  });

  test('should return the first matching traitType if there are multiple matches', () => {
    const updatedAttributes = [
      ...attributes,
      { key: 'author', value: 'Jane Smith' }
    ];
    expect(getPublicationAttribute(updatedAttributes, 'author')).toBe(
      'John Doe'
    );
  });
});
