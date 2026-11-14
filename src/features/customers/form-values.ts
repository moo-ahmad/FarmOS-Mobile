import type { CustomerDto, CustomerRequestBody } from '@/lib/customers';
import { emptyToNull } from '@/lib/forms/rules';

import { CustomerType } from './model';
import type { CustomerFormValues } from './schema';

/** A new customer's starting values: a mandi trader on cash terms. */
export const EMPTY_CUSTOMER_FORM: CustomerFormValues = {
  name: '',
  customerType: CustomerType.MandiTrader,
  commissionPct: '0',
  creditTermDays: '0',
  creditLimit: '',
  phone: '',
  address: '',
};

/** A customer as the form's starting values (decimals as the strings the user edits). */
export function toCustomerFormValues(
  customer: CustomerDto,
): CustomerFormValues {
  return {
    name: customer.name,
    customerType: customer.customerType,
    commissionPct: String(customer.commissionPct),
    creditTermDays: String(customer.creditTermDays),
    creditLimit:
      customer.creditLimit === null ? '' : String(customer.creditLimit),
    phone: customer.phone ?? '',
    address: customer.address ?? '',
  };
}

/** Validated form values as the POST/PUT body — decimals stay strings. */
export function toCustomerRequest(
  values: CustomerFormValues,
): CustomerRequestBody {
  return {
    name: values.name.trim(),
    customerType: values.customerType,
    commissionPct: values.commissionPct.trim(),
    // Whole days, 0–9999 (schema-checked) — an integer, not a decimal.
    creditTermDays: Number.parseInt(values.creditTermDays, 10),
    creditLimit: emptyToNull(values.creditLimit),
    phone: emptyToNull(values.phone),
    address: emptyToNull(values.address),
  };
}
