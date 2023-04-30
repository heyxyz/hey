import { expect, test } from '@playwright/test';
import getTags from 'lib/getTags';

test.describe('getTags', () => {
  test('should return empty array if no tags are found', () => {
    const inputText = 'This is a text without any tags';
    const result = getTags(inputText);
    expect(result).toEqual([]);
  });

  test('should return an array of matching tags (without duplicates)', () => {
    const inputText =
      'This #is a #text with #multiple #tags and #duplicate #tags';
    const result = getTags(inputText);
    expect(result).toEqual(['is', 'text', 'multiple', 'tags', 'duplicate']);
  });

  test('should only return up to 5 tags (in case of more than 5 matches)', () => {
    const inputText = 'This #is a #text with #more than #five #tags #present';
    const result = getTags(inputText);
    expect(result).toHaveLength(5);
  });

  test('should ignore hashtags within words', () => {
    const inputText = 'This#tag should be ignored because it is part of a word';
    const result = getTags(inputText);
    expect(result).toEqual([]);
  });
});
