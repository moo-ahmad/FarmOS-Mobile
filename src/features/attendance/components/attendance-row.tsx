import { View } from 'react-native';

import { SegmentedControl, SquareBadge, Text } from '@/components/ui';
import { moneyToString } from '@/lib/decimal';

import type { Worker } from '../fixtures';
import {
  ATTENDANCE_STATUS_LABEL,
  ATTENDANCE_STATUSES,
  type AttendanceStatus,
} from '../model';

export interface AttendanceRowProps {
  worker: Worker;
  status: AttendanceStatus;
  onChange: (status: AttendanceStatus) => void;
}

/** One worker's attendance row: badge (muted when absent), name/rate, Full/Half/Absent. */
export function AttendanceRow({
  worker,
  status,
  onChange,
}: AttendanceRowProps) {
  return (
    <View className="gap-2.5 px-4 py-3.5">
      <View className="flex-row items-center gap-2.5">
        <SquareBadge
          code={worker.initials}
          size={34}
          muted={status === 'absent'}
        />
        <View className="flex-1">
          <Text variant="row">{worker.name}</Text>
          <Text variant="caption" tone="muted">
            {worker.employment} · ${moneyToString(worker.dailyRate)}/day
          </Text>
        </View>
      </View>
      <SegmentedControl
        compact
        negativeValue="absent"
        options={ATTENDANCE_STATUSES.map((s) => ({
          value: s,
          label: ATTENDANCE_STATUS_LABEL[s],
        }))}
        value={status}
        onChange={onChange}
      />
    </View>
  );
}
