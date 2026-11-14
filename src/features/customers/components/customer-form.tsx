import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useImperativeHandle } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { SelectField } from '@/components/select-field';
import { NumericField, TextField } from '@/components/ui';

import { CUSTOMER_TYPE_OPTIONS } from '../model';
import { customerFormSchema, type CustomerFormValues } from '../schema';

export interface CustomerFormProps {
  /** Starting values; read once, on mount. */
  initialValues: CustomerFormValues;
  onSubmit: (values: CustomerFormValues) => void;
}

export interface CustomerFormHandle {
  submit: () => void;
}

/**
 * Add/Edit Customer fields, wired to the `POST`/`PUT /api/customers`
 * contract. Commission, credit days and credit limit use the numeric keypad
 * and stay strings end to end.
 */
export const CustomerForm = forwardRef<CustomerFormHandle, CustomerFormProps>(
  function CustomerForm({ initialValues, onSubmit }, ref) {
    const { control, handleSubmit } = useForm<CustomerFormValues>({
      resolver: zodResolver(customerFormSchema),
      defaultValues: initialValues,
    });

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    return (
      <View className="px-4 py-4">
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <TextField
              label="Name"
              placeholder="e.g. Aslam Traders"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="customerType"
          render={({ field }) => (
            <SelectField
              label="Customer type"
              value={field.value}
              options={CUSTOMER_TYPE_OPTIONS}
              onChange={field.onChange}
            />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field, fieldState }) => (
            <TextField
              label="Phone (optional)"
              placeholder="0300-1234567"
              keyboardType="phone-pad"
              inputMode="tel"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />

        <View className="mt-4 flex-row gap-2.5">
          <Controller
            control={control}
            name="commissionPct"
            render={({ field, fieldState }) => (
              <NumericField
                label="Commission %"
                placeholder="0"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
          <Controller
            control={control}
            name="creditTermDays"
            render={({ field, fieldState }) => (
              <NumericField
                label="Credit days"
                placeholder="0"
                keyboardType="number-pad"
                inputMode="numeric"
                value={field.value}
                onChangeText={field.onChange}
                error={fieldState.error?.message}
                containerClassName="flex-1"
              />
            )}
          />
        </View>

        <Controller
          control={control}
          name="creditLimit"
          render={({ field, fieldState }) => (
            <NumericField
              label="Credit limit (optional)"
              placeholder="No limit"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              containerClassName="mt-4"
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field, fieldState }) => (
            <TextField
              label="Address (optional)"
              placeholder="e.g. Grain market, Okara"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error?.message}
              multiline
              containerClassName="mt-4"
            />
          )}
        />
      </View>
    );
  },
);
