import { useRef } from 'react';
import { ScrollView } from 'react-native';

import { Button, CaptureFooter, CaptureHeader, Screen } from '@/components/ui';

import { fields } from '../fixtures';
import { type AddFieldFormValues } from '../schema';
import { AddFieldForm, type AddFieldFormHandle } from './add-field-form';

export interface AddFieldScreenProps {
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Add Field (design handoff: FarmOS Land, "Add field" frame): a capture-style
 * modal, same shell as Log Expense. UI-first — Save validates and returns to
 * the screen it was opened from; persistence isn't wired yet.
 */
export function AddFieldScreen({ onClose, onSaved }: AddFieldScreenProps) {
  const formRef = useRef<AddFieldFormHandle>(null);
  const nextCode = `F${fields.length + 1}`;

  const handleSubmit = (_values: AddFieldFormValues) => {
    onSaved();
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader kicker="New entry" title="Add field" onClose={onClose} />
      <ScrollView className="bg-neutral-0">
        <AddFieldForm
          ref={formRef}
          nextCode={nextCode}
          onSubmit={handleSubmit}
        />
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save field"
          haptic="success"
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
