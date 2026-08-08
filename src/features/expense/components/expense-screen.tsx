import { useRef } from 'react';
import { ScrollView } from 'react-native';

import { Button, CaptureFooter, CaptureHeader, Screen } from '@/components/ui';
import type { CropCycle } from '@/features/home';

import { ExpenseForm, type ExpenseFormHandle } from './expense-form';

export interface ExpenseScreenProps {
  onClose: () => void;
  onSaved: () => void;
  /** Pre-fills "Allocate to" — defaults to the first active cycle. */
  initialCycle: CropCycle;
}

/**
 * Log Expense (canvas `1a`, frame 8): a capture modal. UI-first — Save
 * validates and returns to the screen it was opened from; persistence isn't
 * wired yet (see the ui-conventions plan).
 */
export function ExpenseScreen({
  onClose,
  onSaved,
  initialCycle,
}: ExpenseScreenProps) {
  const formRef = useRef<ExpenseFormHandle>(null);

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader kicker="New entry" title="Log expense" onClose={onClose} />
      <ScrollView className="bg-neutral-0">
        <ExpenseForm
          ref={formRef}
          initialCycle={initialCycle}
          onSubmit={() => onSaved()}
        />
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save expense"
          haptic="success"
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
