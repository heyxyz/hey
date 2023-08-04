import { describe, expect, test } from 'vitest';

import { Regex } from '../../regex';

const validate = (text: string) => {
  Regex.handle.lastIndex = 0;
  return Regex.handle.test(text);
};

describe('handle regex', () => {
  test('should pass for valid handles', () => {
    expect(validate('example')).toBe(true);
    expect(validate('handle123')).toBe(true);
    expect(validate('username')).toBe(true);
    expect(validate('abc123')).toBe(true);
  });

  test('should fail for underscore', () => {
    expect(validate('john_doe_123')).toBe(false);
  });

  test('should fail for uppercase letters', () => {
    expect(validate('Abc123')).toBe(false);
    expect(validate('Handle')).toBe(false);
    expect(validate('TestUser')).toBe(false);
  });

  test('should fail for special characters', () => {
    expect(validate('handle@user')).toBe(false);
    expect(validate('user*name')).toBe(false);
    expect(validate('name#123')).toBe(false);
  });

  test('should fail for empty string', () => {
    expect(validate('')).toBe(false);
  });
});
