import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';
import type { FieldDto } from '@/lib/fields';

import { fieldApiErrorMessage } from '../errors';
import { useFields, useUpdateField } from '../hooks';
import { toFieldFormValues } from '../field-form-values';
import { type AddFieldFormValues } from '../schema';
import { AddFieldForm, type AddFieldFormHandle } from './add-field-form';

export interface EditFieldScreenProps {
  field: FieldDto;
  onClose: () => void;
  /** Called with the saved field (its code may have changed). */
  onSaved: (field: FieldDto) => void;
}

/**
 * Edit Field: the Add Field form prefilled from the field, saved with
 * `PUT /api/fields/{id}`. The parent field and boundary centroid aren't
 * editable here yet, so they're sent back unchanged.
 */
export function EditFieldScreen({
  field,
  onClose,
  onSaved,
}: EditFieldScreenProps) {
  const formRef = useRef<AddFieldFormHandle>(null);
  const fields = useFields();
  const updateField = useUpdateField(field.fieldId);

  const initialValues = useMemo(() => toFieldFormValues(field), [field]);

  // Every other field's code — this field may keep its own.
  const existingCodes = useMemo(
    () =>
      (fields.data?.fields ?? [])
        .filter((f) => f.fieldId !== field.fieldId)
        .map((f) => f.code),
    [fields.data, field.fieldId],
  );

  const handleSubmit = (values: AddFieldFormValues) => {
    updateField.mutate(
      {
        code: values.code,
        name: values.name,
        areaValue: values.area,
        areaUomId: values.areaUomId,
        usageType: values.usageType,
        soilTexture: values.soilTexture,
        primaryIrrigationSourceId: values.primaryIrrigationSourceId,
        parentFieldId: field.parentFieldId,
        centroidLat: field.centroidLat,
        centroidLng: field.centroidLng,
      },
      { onSuccess: onSaved },
    );
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader kicker={field.code} title="Edit field" onClose={onClose} />
      <ScrollView className="bg-neutral-0">
        <AddFieldForm
          ref={formRef}
          initialValues={initialValues}
          existingCodes={existingCodes}
          originalCode={field.code}
          onSubmit={handleSubmit}
        />
        {updateField.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            {fieldApiErrorMessage(updateField.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save changes"
          haptic="success"
          loading={updateField.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
