import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';
import type { CustomerDto } from '@/lib/customers';

import { customerApiErrorMessage } from '../errors';
import {
  EMPTY_CUSTOMER_FORM,
  toCustomerFormValues,
  toCustomerRequest,
} from '../form-values';
import { useCreateCustomer, useUpdateCustomer } from '../hooks';
import type { CustomerFormValues } from '../schema';
import { CustomerForm, type CustomerFormHandle } from './customer-form';

export interface CustomerFormScreenProps {
  /** Omit to add a new customer; pass one to edit it. */
  customer?: CustomerDto;
  onClose: () => void;
  onSaved: (customer: CustomerDto) => void;
}

/** Add Customer / Edit Customer — a capture-style modal like Add Field. */
export function CustomerFormScreen({
  customer,
  onClose,
  onSaved,
}: CustomerFormScreenProps) {
  const formRef = useRef<CustomerFormHandle>(null);
  const create = useCreateCustomer();
  const update = useUpdateCustomer(customer?.customerId ?? -1);
  const mutation = customer ? update : create;

  const initialValues = useMemo(
    () => (customer ? toCustomerFormValues(customer) : EMPTY_CUSTOMER_FORM),
    [customer],
  );

  const handleSubmit = (values: CustomerFormValues) => {
    mutation.mutate(toCustomerRequest(values), { onSuccess: onSaved });
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={customer ? customer.name : 'New entry'}
        title={customer ? 'Edit customer' : 'Add customer'}
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <CustomerForm
          ref={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
        {mutation.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            {customerApiErrorMessage(mutation.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title={customer ? 'Save changes' : 'Save customer'}
          haptic="success"
          loading={mutation.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
