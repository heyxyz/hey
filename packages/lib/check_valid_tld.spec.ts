import { describe, expect, test } from 'vitest';

import { isUrlContainsValidTld } from './check_valid_tld';

describe('isUrlContainsValidTld function', () => {
  test('should return true for URLs with valid TLDs', () => {
    expect(isUrlContainsValidTld('http://example.com')).toBe(true);
    expect(isUrlContainsValidTld('https://example.com')).toBe(true);
    expect(isUrlContainsValidTld('example.com')).toBe(true);
    expect(isUrlContainsValidTld('hitesh.dev')).toBe(true);

    expect(isUrlContainsValidTld('http://sub.example.co.uk')).toBe(true);
    expect(isUrlContainsValidTld('https://sub.example.co.uk')).toBe(true);
  });

  test('should return false for URLs with invalid TLDs', () => {
    expect(isUrlContainsValidTld('http://example.invalidtld')).toBe(false);
    expect(isUrlContainsValidTld('https://example.123')).toBe(false);
    expect(isUrlContainsValidTld('hitesh.foodkk')).toBe(false);
    expect(isUrlContainsValidTld('http://example.in_valid')).toBe(false);
    expect(isUrlContainsValidTld('https://example.-invalid')).toBe(false);
  });
});
