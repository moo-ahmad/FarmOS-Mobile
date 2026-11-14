import { describe, expect, it } from '@jest/globals';

import { ApiError } from '@/lib/http/errors';
import type { FieldDto } from '@/lib/fields';

import { deleteFieldErrorMessage } from './errors';
import { toFieldFormValues } from './field-form-values';
import { createAddFieldFormSchema } from './schema';

const field: FieldDto = {
  fieldId: 7,
  publicId: 'p',
  code: 'CS-1',
  name: 'Canal side',
  areaValue: 3.5,
  areaUomId: 28,
  areaAcres: 3.5,
  usageType: 35000,
  soilTexture: 47002,
  primaryIrrigationSourceId: 2,
  parentFieldId: null,
  centroidLat: null,
  centroidLng: null,
  isActive: true,
};

describe('toFieldFormValues', () => {
  it('prefills the form from a field, keeping area as a string', () => {
    expect(toFieldFormValues(field)).toEqual({
      code: 'CS-1',
      name: 'Canal side',
      area: '3.5',
      areaUomId: 28,
      usageType: 35000,
      soilTexture: 47002,
      primaryIrrigationSourceId: 2,
    });
  });
});

describe('createAddFieldFormSchema code rule', () => {
  const values = toFieldFormValues(field);

  it('rejects a legacy code like CS-1 on a new field', () => {
    const result = createAddFieldFormSchema([]).safeParse(values);
    expect(result.success).toBe(false);
  });

  it('accepts the unchanged original code when editing', () => {
    const result = createAddFieldFormSchema(['TW-2'], 'CS-1').safeParse(values);
    expect(result.success).toBe(true);
  });

  it('still applies the rules to a changed code when editing', () => {
    const schema = createAddFieldFormSchema(['TW2'], 'CS-1');
    expect(schema.safeParse({ ...values, code: 'TW2' }).success).toBe(false);
    expect(schema.safeParse({ ...values, code: 'CS-12' }).success).toBe(false);
    expect(schema.safeParse({ ...values, code: 'CS1' }).success).toBe(true);
  });
});

describe('deleteFieldErrorMessage', () => {
  it('explains a 422 (field has history) without relying on the API detail', () => {
    const error = new ApiError(422, '/api/fields/7', { title: 'x' });
    expect(deleteFieldErrorMessage(error)).toMatch(/Deactivate it instead/);
  });

  it('handles a field that is already gone', () => {
    expect(
      deleteFieldErrorMessage(new ApiError(404, '/api/fields/7', {})),
    ).toBe('This field no longer exists.');
  });
});
