import { describe, expect, test } from 'vitest';

import { Regex } from '../../regex';

const validate = (text: string) => {
  Regex.mention.lastIndex = 0;
  return Regex.mention.test(text);
};

describe('handle regex', () => {
  test('should pass for string starting with @ followed by 1-30 characters', () => {
    expect(validate('@john_doe-123')).toBe(true);
    expect(validate('@example.email-service')).toBe(true);
    expect(validate('@a.b-c')).toBe(true);
    expect(validate('@username')).toBe(true);
    expect(validate('@abc123')).toBe(true);
  });

  test.skip('should fail for string with uppercase letters after @', () => {
    expect(validate('@Abc123')).toBe(false);
  });

  test.skip('should fail for string with spaces after @', () => {
    expect(validate('@abc 123')).toBe(false);
  });

  test.skip('should fail for string with special characters after @', () => {
    expect(validate('@abc!def')).toBe(false);
  });

  test('should fail for string that does not end with a word character or a hyphen', () => {
    expect(validate('@.....')).toBe(false);
  });

  test.skip('should fail for string longer than 30 characters after @', () => {
    expect(validate('@abcdefghij1234567890abcdefghij12')).toBe(false);
  });

  test('should fail for empty string', () => {
    expect(validate('')).toBe(false);
  });
});
