import { describe, expect, it } from '@jest/globals';

import { loginSchema } from './schema';

describe('loginSchema', () => {
  it('accepts a valid email/password', () => {
    expect(
      loginSchema.safeParse({
        identifier: 'jamil@greenfield.farm',
        password: 'secret',
      }).success,
    ).toBe(true);
  });

  it('requires an identifier', () => {
    expect(
      loginSchema.safeParse({ identifier: '   ', password: 'secret' }).success,
    ).toBe(false);
  });

  it('requires a password', () => {
    expect(
      loginSchema.safeParse({
        identifier: 'jamil@greenfield.farm',
        password: '',
      }).success,
    ).toBe(false);
  });
});
