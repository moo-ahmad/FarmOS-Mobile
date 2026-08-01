import { describe, expect, it } from '@jest/globals';

import { isUuidV7, newId } from './index';

describe('ids', () => {
  it('newId returns a canonical UUIDv7', () => {
    const id = newId();
    expect(id).toHaveLength(36);
    expect(id[14]).toBe('7'); // version nibble
    expect(isUuidV7(id)).toBe(true);
  });

  it('generates unique, lexicographically increasing ids', () => {
    const ids = Array.from({ length: 2000 }, () => newId());
    expect(new Set(ids).size).toBe(ids.length); // all unique
    expect(ids).toEqual([...ids].sort()); // monotonic → sorts to itself
  });

  it('isUuidV7 rejects junk, non-strings, and a v4 uuid', () => {
    expect(isUuidV7('not-a-uuid')).toBe(false);
    expect(isUuidV7('00000000-0000-4000-8000-000000000000')).toBe(false);
    expect(isUuidV7(123)).toBe(false);
    expect(isUuidV7(null)).toBe(false);
  });
});
