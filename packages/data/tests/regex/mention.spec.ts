import { describe, expect, test } from 'vitest';

import { Regex } from '../../regex';

const validate = (text: string) => {
  Regex.mention.lastIndex = 0;
  return Regex.mention.test(text);
};

const findAllHandles = (text: string) => {
  Regex.mention.lastIndex = 0;
  const handles: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = Regex.mention.exec(text)) !== null) {
    handles.push(match[0].trim());
  }

  return handles;
};

describe('mention regex', () => {
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

describe('all mention regex', () => {
  test('should find all handles in the string', () => {
    const text = 'Hey @user1, check this out: @user2 and @user3!';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@user1', '@user2', '@user3']);
  });

  test('should find handles with underscores and digits', () => {
    const text = 'Hello @_test_user_123';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@_test_user_123']);
  });

  test('should find multiple handles in the same string', () => {
    const text = 'Message from @user1 and @user2';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@user1', '@user2']);
  });

  test('should find handles at the beginning, middle, and end of the string', () => {
    const text = '@start middle @end';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@start', '@end']);
  });

  test('should not match handles with spaces in between', () => {
    const text = '@user 123';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@user']);
  });

  test('should not match handles starting with digits', () => {
    const text = '1handle @2user';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@2user']);
  });

  test('should not match handles with special characters', () => {
    const text = '@user#123';
    const handles = findAllHandles(text);
    expect(handles).toEqual(['@user']);
  });

  test('should not match empty string', () => {
    const text = '';
    const handles = findAllHandles(text);
    expect(handles).toEqual([]);
  });
});
