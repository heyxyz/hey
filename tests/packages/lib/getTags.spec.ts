import getTags from '@lenster/lib/getTags';
import { expect, test } from '@playwright/test';

test.describe('getTags', () => {
  test('should return an array of unique tags from input text', () => {
    const inputText =
      'This is a #test with #multiple #tags and #duplicates #test';
    const expectedTags = ['test', 'multiple', 'tags', 'duplicates'];

    expect(getTags(inputText)).toEqual(expectedTags);
  });

  test('should return an empty array when there are no tags in input text', () => {
    const inputText = 'This is a test without any tags';
    const expectedTags: string[] = [];

    expect(getTags(inputText)).toEqual(expectedTags);
  });

  test('should return only the first 5 unique tags from input text', () => {
    const inputText =
      'This is a #test with #multiple #tags and #duplicates #test #extra #tags';
    const expectedTags = ['test', 'multiple', 'tags', 'duplicates', 'extra'];

    expect(getTags(inputText)).toEqual(expectedTags);
  });
});
