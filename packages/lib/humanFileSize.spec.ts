import { describe, expect, test } from 'vitest';

import humanFileSize from './humanFileSize';

describe('humanFileSize', () => {
  test('should return the correct file size for bytes', () => {
    const fileSize = 512;
    const result = humanFileSize(fileSize);
    expect(result).toBe('512 B');
  });

  test('should return the correct file size for kilobytes', () => {
    const fileSize = 1024 * 2.5;
    const result = humanFileSize(fileSize);
    expect(result).toBe('2.5 KB');
  });

  test('should return the correct file size for megabytes', () => {
    const fileSize = 1024 * 1024 * 3.75;
    const result = humanFileSize(fileSize);
    expect(result).toBe('3.8 MB');
  });

  test('should return the correct file size for gigabytes', () => {
    const fileSize = 1024 * 1024 * 1024 * 1.25;
    const result = humanFileSize(fileSize);
    expect(result).toBe('1.3 GB');
  });

  test('should return the correct file size for terabytes', () => {
    const fileSize = 1024 * 1024 * 1024 * 1024 * 1024 * 0.005;
    const result = humanFileSize(fileSize);
    expect(result).toBe('5.1 TB');
  });

  test('should return the correct file size for petabytes', () => {
    const fileSize = 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 0.001;
    const result = humanFileSize(fileSize);
    expect(result).toBe('1.0 PB');
  });
});
