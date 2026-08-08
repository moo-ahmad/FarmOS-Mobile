import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight } from 'lucide-react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Alert, Pressable, View } from 'react-native';

import {
  ChipRow,
  MicroLabel,
  SegmentedControl,
  Text,
  TextField,
} from '@/components/ui';
import { CyclePicker } from '@/components/cycle-picker';
import { CycleSelectorRow } from '@/components/cycle-selector-row';
import type { CropCycle } from '@/features/home';
import { colors } from '@/theme';

import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_LABEL,
  PAID_BY_LABEL,
  PAID_BY_OPTIONS,
} from '../model';
import { expenseFormSchema, type ExpenseFormValues } from '../schema';
import { AmountField } from './amount-field';

export interface ExpenseFormProps {
  onSubmit: (values: ExpenseFormValues) => void;
  initialCycle: CropCycle;
}

export interface ExpenseFormHandle {
  submit: () => void;
}

export const ExpenseForm = forwardRef<ExpenseFormHandle, ExpenseFormProps>(
  function ExpenseForm({ onSubmit, initialCycle }, ref) {
    const pickerRef = useRef<BottomSheetModal>(null);
    const { control, handleSubmit, setValue } = useForm<ExpenseFormValues>({
      resolver: zodResolver(expenseFormSchema),
      defaultValues: {
        amount: '',
        category: 'inputs',
        payee: '',
        fieldCode: initialCycle.fieldCode,
        cropLabel: initialCycle.title,
        paidBy: 'cash',
      },
    });

    const fieldCode = useWatch({ control, name: 'fieldCode' });
    const cropLabel = useWatch({ control, name: 'cropLabel' });

    useImperativeHandle(
      ref,
      () => ({ submit: () => void handleSubmit(onSubmit)() }),
      [handleSubmit, onSubmit],
    );

    return (
      <View className="px-4 py-4">
        <MicroLabel>Amount</MicroLabel>
        <View className="mb-[18px] mt-2">
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <AmountField value={field.value} onChangeText={field.onChange} />
            )}
          />
        </View>

        <MicroLabel>Category</MicroLabel>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <ChipRow
              className="mb-4 mt-2"
              options={EXPENSE_CATEGORIES}
              value={field.value}
              onChange={field.onChange}
              labelFor={(c) => EXPENSE_CATEGORY_LABEL[c]}
            />
          )}
        />

        <Controller
          control={control}
          name="payee"
          render={({ field, fieldState }) => (
            <TextField
              label="Payee"
              placeholder="e.g. Al-Karim Agri Store"
              value={field.value}
              onChangeText={field.onChange}
              error={fieldState.error ? 'Required' : undefined}
              containerClassName="mb-[18px]"
              trailing={
                <ChevronRight
                  size={18}
                  color={colors.neutral[500]}
                  strokeWidth={2}
                />
              }
            />
          )}
        />

        <View className="mb-2 flex-row items-center justify-between">
          <MicroLabel>Allocate to</MicroLabel>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              Alert.alert(
                'Split cost',
                'Allocating an expense across multiple cycles is coming soon.',
              )
            }
          >
            <Text tone="accent" className="font-archivo-bold text-label">
              Split
            </Text>
          </Pressable>
        </View>
        <CycleSelectorRow
          fieldCode={fieldCode}
          cropLabel={cropLabel}
          sub="Direct · 100%"
          onPress={() => pickerRef.current?.present()}
        />
        <CyclePicker
          ref={pickerRef}
          onSelect={(cycle) => {
            setValue('fieldCode', cycle.fieldCode, { shouldValidate: true });
            setValue('cropLabel', cycle.title, { shouldValidate: true });
            pickerRef.current?.dismiss();
          }}
        />

        <View className="mt-4">
          <MicroLabel>Paid by</MicroLabel>
          <Controller
            control={control}
            name="paidBy"
            render={({ field }) => (
              <SegmentedControl
                className="mt-1.5"
                compact
                options={PAID_BY_OPTIONS.map((p) => ({
                  value: p,
                  label: PAID_BY_LABEL[p],
                }))}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </View>
      </View>
    );
  },
);
