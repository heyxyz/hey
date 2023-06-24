import { describe, expect, test } from 'vitest';

import isLensTeamMember from './isLensTeamMember';

describe('isLensTeamMember', () => {
  test('should return true for a Lens team member profile', () => {
    const id = '0x05';
    const result = isLensTeamMember(id);
    expect(result).toBeTruthy();
  });

  test('should return false for a non-team member profile', () => {
    const id = '0x5d';
    const result = isLensTeamMember(id);
    expect(result).toBeFalsy();
  });
});
