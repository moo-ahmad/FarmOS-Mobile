export {
  CustomersScreen,
  type CustomersScreenProps,
} from './components/customers-screen';
export {
  CustomerFormScreen,
  type CustomerFormScreenProps,
} from './components/customer-form-screen';
export {
  CustomerDetailScreen,
  type CustomerDetailScreenProps,
} from './components/customer-detail-screen';
export {
  customerKeys,
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useSetCustomerActive,
  useDeleteCustomer,
} from './hooks';
export {
  CustomerType,
  CUSTOMER_TYPES,
  CUSTOMER_TYPE_OPTIONS,
  customerTypeLabel,
} from './model';
export type { CustomerFormValues } from './schema';
