import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';

import { fieldApiErrorMessage } from '../errors';
import { useCreateField, useFields } from '../hooks';
import { type AddFieldFormValues } from '../schema';
import { AddFieldForm, type AddFieldFormHandle } from './add-field-form';

export interface AddFieldScreenProps {
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Add Field (design handoff: FarmOS Land, "Add field" frame): a capture-style
 * modal, same shell as Log Expense. Wired to `POST /api/fields`.
 */
export function AddFieldScreen({ onClose, onSaved }: AddFieldScreenProps) {
  const formRef = useRef<AddFieldFormHandle>(null);
  const fields = useFields();
  const createField = useCreateField();

  const existingCodes = useMemo(
    () => fields.data?.fields.map((f) => f.code) ?? [],
    [fields.data],
  );

  // 4-char alphanumeric only (Add Field's own, stricter-than-backend rule) —
  // "F" + a zero-padded count fits within that for the first 999 fields.
  const nextCode = useMemo(() => {
    const count = fields.data?.fields.length ?? 0;
    return `F${String(count + 1).padStart(3, '0')}`;
  }, [fields.data]);

  const handleSubmit = (values: AddFieldFormValues) => {
    createField.mutate(
      {
        code: values.code,
        name: values.name,
        areaValue: Number(values.area),
        areaUomId: values.areaUomId,
        usageType: values.usageType,
        soilTextureId: values.soilTextureId,
        primaryIrrigationSourceId: values.primaryIrrigationSourceId,
        parentFieldId: null,
        centroidLat: null,
        centroidLng: null,
      },
      { onSuccess: onSaved },
    );
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader kicker="New entry" title="Add field" onClose={onClose} />
      <ScrollView className="bg-neutral-0">
        <AddFieldForm
          ref={formRef}
          nextCode={nextCode}
          existingCodes={existingCodes}
          onSubmit={handleSubmit}
        />
        {createField.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            {fieldApiErrorMessage(createField.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save field"
          haptic="success"
          loading={createField.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
