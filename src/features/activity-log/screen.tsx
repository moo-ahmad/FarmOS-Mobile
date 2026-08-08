import { useRef } from 'react';
import { ScrollView } from 'react-native';

import { Button, CaptureFooter, CaptureHeader, Screen } from '@/components/ui';
import type { CropCycle } from '@/features/home';
import { getCurrentFarmId } from '@/lib/farm';

import {
  ActivityLogForm,
  type ActivityLogFormHandle,
} from './components/activity-log-form';
import { useCreateActivityLog } from './hooks';
import type { Operation } from './model';

export interface ActivityLogScreenProps {
  onClose: () => void;
  /** Called after the entry is saved — the route decides where to go next. */
  onSaved: () => void;
  /** Pre-fills the field/crop selector — the reminder deep-link path. */
  initialCycle?: CropCycle;
  /** Pre-selects the operation chip — also part of the deep-link path. */
  initialOperation?: Operation;
}

/**
 * Log Activity (canvas `1a`, frame 6): a capture modal. ✕ dismisses; the
 * footer button saves the entry (writes locally + enqueues for sync) and
 * returns to the screen the FAB/deep-link was opened from.
 */
export function ActivityLogScreen({
  onClose,
  onSaved,
  initialCycle,
  initialOperation,
}: ActivityLogScreenProps) {
  const farmId = getCurrentFarmId();
  const create = useCreateActivityLog(farmId);
  const formRef = useRef<ActivityLogFormHandle>(null);

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="New entry"
        title="Log activity"
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0">
        <ActivityLogForm
          ref={formRef}
          initialCycle={initialCycle}
          initialOperation={initialOperation}
          onSubmit={(values) => create.mutate(values, { onSuccess: onSaved })}
        />
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Log activity"
          haptic="success"
          loading={create.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
