import { describe, expect, it } from '@jest/globals';

import type { CustomerDto } from '@/lib/customers';
import { ApiError } from '@/lib/http/errors';

import { customerApiErrorMessage, deleteCustomerErrorMessage } from './errors';
import {
  EMPTY_CUSTOMER_FORM,
  toCustomerFormValues,
  toCustomerRequest,
} from './form-values';
import { CustomerType, customerTypeLabel } from './model';
import { customerFormSchema } from './schema';

const customer: CustomerDto = {
  customerId: 4,
  publicId: 'p',
  name: 'Aslam Traders',
  customerType: CustomerType.Arthi,
  phone: '0300-1234567',
  address: null,
  commissionPct: 2.5,
  creditTermDays: 15,
  creditLimit: null,
  isActive: true,
};

describe('customer form values', () => {
  it('round-trips a customer through the form into a request, decimals as strings', () => {
    const values = toCustomerFormValues(customer);
    expect(values.commissionPct).toBe('2.5');
    expect(values.creditLimit).toBe('');

    expect(toCustomerRequest(values)).toEqual({
      name: 'Aslam Traders',
      customerType: 24000,
      commissionPct: '2.5',
      creditTermDays: 15,
      creditLimit: null,
      phone: '0300-1234567',
      address: null,
    });
  });

  it('trims text and turns blank optionals into null', () => {
    const request = toCustomerRequest({
      ...EMPTY_CUSTOMER_FORM,
      name: '  Haji Sb  ',
      phone: '   ',
      creditLimit: '50000',
    });
    expect(request.name).toBe('Haji Sb');
    expect(request.phone).toBeNull();
    expect(request.creditLimit).toBe('50000');
  });
});

describe('customerFormSchema', () => {
  const valid = { ...EMPTY_CUSTOMER_FORM, name: 'Aslam' };

  it('accepts the empty form once a name is given', () => {
    expect(customerFormSchema.safeParse(valid).success).toBe(true);
    expect(customerFormSchema.safeParse(EMPTY_CUSTOMER_FORM).success).toBe(
      false,
    );
  });

  it.each([
    ['commission above 100', { commissionPct: '100.5' }],
    ['negative commission', { commissionPct: '-1' }],
    ['fractional credit days', { creditTermDays: '1.5' }],
    ['negative credit limit', { creditLimit: '-5' }],
    ['non-numeric credit limit', { creditLimit: 'lots' }],
    ['unknown customer type', { customerType: 99 }],
  ])('rejects %s', (_label, patch) => {
    expect(customerFormSchema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });

  it('accepts commission at the 0 and 100 bounds', () => {
    for (const commissionPct of ['0', '100']) {
      expect(
        customerFormSchema.safeParse({ ...valid, commissionPct }).success,
      ).toBe(true);
    }
  });
});

describe('customer labels and errors', () => {
  it('labels a known type from the lookup catalogue and survives an unknown one', () => {
    expect(customerTypeLabel(CustomerType.MandiTrader)).toBe('Mandi Trader');
    expect(customerTypeLabel(24999)).toBe('Other');
  });

  it('explains a 422 delete without relying on the API detail', () => {
    expect(
      deleteCustomerErrorMessage(new ApiError(422, '/api/customers/4', {})),
    ).toMatch(/Deactivate them instead/);
  });

  it('surfaces the first validation message from a 400', () => {
    const error = new ApiError(400, '/api/customers', {
      errors: { Name: ["'Name' must not be empty."] },
    });
    expect(customerApiErrorMessage(error)).toBe("'Name' must not be empty.");
  });
});
