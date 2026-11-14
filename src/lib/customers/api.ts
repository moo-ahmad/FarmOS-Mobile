import { apiRequest, type AuthContext } from '@/lib/http/request';

/**
 * A customer as returned by the API (`FarmOS.Application.Customers.CustomerDto`).
 * `customerType` is the `CustomerType` lookup value (Arthi = 24000, …).
 * Decimals arrive as JSON numbers — display only, never do arithmetic on them.
 */
export interface CustomerDto {
  customerId: number;
  publicId: string;
  name: string;
  customerType: number;
  phone: string | null;
  address: string | null;
  commissionPct: number;
  creditTermDays: number;
  creditLimit: number | null;
  isActive: boolean;
}

export interface CustomerRequestBody {
  name: string;
  customerType: number;
  /** Decimal as a string (the API accepts `number | string`) — never a JS number. */
  commissionPct: string;
  creditTermDays: number;
  /** Decimal as a string, or null for no limit. */
  creditLimit: string | null;
  phone: string | null;
  address: string | null;
}

/** GET /api/customers — every customer on the farm (active and deactivated), by name. */
export function fetchCustomers(auth: AuthContext): Promise<CustomerDto[]> {
  return apiRequest('/api/customers', auth);
}

/** GET /api/customers/{id}. */
export function fetchCustomerById(
  customerId: number,
  auth: AuthContext,
): Promise<CustomerDto> {
  return apiRequest(`/api/customers/${customerId}`, auth);
}

/** POST /api/customers — 201 Created with the new customer. */
export function createCustomer(
  body: CustomerRequestBody,
  auth: AuthContext,
): Promise<CustomerDto> {
  return apiRequest('/api/customers', auth, { method: 'POST', body });
}

/** PUT /api/customers/{id}. */
export function updateCustomer(
  customerId: number,
  body: CustomerRequestBody,
  auth: AuthContext,
): Promise<CustomerDto> {
  return apiRequest(`/api/customers/${customerId}`, auth, {
    method: 'PUT',
    body,
  });
}

/** POST /api/customers/{id}/deactivate — hides the customer; sales keep referencing it. */
export function deactivateCustomer(
  customerId: number,
  auth: AuthContext,
): Promise<CustomerDto> {
  return apiRequest(`/api/customers/${customerId}/deactivate`, auth, {
    method: 'POST',
  });
}

/** POST /api/customers/{id}/reactivate. */
export function reactivateCustomer(
  customerId: number,
  auth: AuthContext,
): Promise<CustomerDto> {
  return apiRequest(`/api/customers/${customerId}/reactivate`, auth, {
    method: 'POST',
  });
}

/** DELETE /api/customers/{id} — 204; a 422 once any sale references the customer. */
export function deleteCustomer(
  customerId: number,
  auth: AuthContext,
): Promise<void> {
  return apiRequest(`/api/customers/${customerId}`, auth, {
    method: 'DELETE',
  });
}
