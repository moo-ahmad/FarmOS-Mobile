import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';
import { useFields } from '@/features/fields';
import type { CropCycleDto } from '@/lib/crop-cycles';

import { cropCycleApiErrorMessage } from '../errors';
import {
  emptyCropCycleForm,
  toCreateCropCycleRequest,
  toCropCycleFormValues,
  toUpdateCropCycleRequest,
} from '../form-values';
import { useCreateCropCycle, useCrops, useUpdateCropCycle } from '../hooks';
import type { CropCycleFormValues } from '../schema';
import { CropCycleForm, type CropCycleFormHandle } from './crop-cycle-form';

export interface CropCycleFormScreenProps {
  /** Omit to plan a new cycle; pass one to edit it. */
  cycle?: CropCycleDto;
  /** Pre-picks for a new cycle, e.g. opened from a season or a field. */
  preset?: { fieldId?: number; seasonId?: number };
  onClose: () => void;
  onSaved: (cycle: CropCycleDto) => void;
}

/** New crop cycle / Edit crop cycle — a capture-style modal like Add Field. */
export function CropCycleFormScreen({
  cycle,
  preset,
  onClose,
  onSaved,
}: CropCycleFormScreenProps) {
  const formRef = useRef<CropCycleFormHandle>(null);
  const create = useCreateCropCycle();
  const update = useUpdateCropCycle(cycle?.cropCycleId ?? -1);
  const mutation = cycle ? update : create;
  const fields = useFields();
  const crops = useCrops();
  const [unitsMissing, setUnitsMissing] = useState(false);

  // Read once: the form takes its starting values on mount.
  const [initialValues] = useState(() =>
    cycle ? toCropCycleFormValues(cycle) : emptyCropCycleForm(preset),
  );

  const handleSubmit = (values: CropCycleFormValues) => {
    if (cycle) {
      update.mutate(toUpdateCropCycleRequest(values, cycle), {
        onSuccess: onSaved,
      });
      return;
    }
    // Area goes in the field's own unit, yield in the crop's default unit.
    const field = fields.data?.fields.find((f) => f.fieldId === values.fieldId);
    const crop = crops.data?.find((c) => c.cropId === values.cropId);
    if (!field || !crop) {
      setUnitsMissing(true);
      return;
    }
    setUnitsMissing(false);
    create.mutate(
      toCreateCropCycleRequest(values, {
        areaUomId: field.areaUomId,
        yieldUomId: crop.defaultYieldUomId,
      }),
      { onSuccess: onSaved },
    );
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={cycle ? cycle.cycleCode : 'New entry'}
        title={cycle ? 'Edit crop cycle' : 'New crop cycle'}
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <CropCycleForm
          ref={formRef}
          initialValues={initialValues}
          editing={cycle ? { areaUomId: cycle.areaUomId } : undefined}
          onSubmit={handleSubmit}
        />
        {unitsMissing ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            Still loading fields and crops — try again in a moment.
          </Text>
        ) : mutation.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            {cropCycleApiErrorMessage(mutation.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title={cycle ? 'Save changes' : 'Save cycle'}
          haptic="success"
          loading={mutation.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
