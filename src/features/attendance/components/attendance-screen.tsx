import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  MicroLabel,
  Screen,
  Text,
} from '@/components/ui';
import { formatInTimeZone, nowUtc } from '@/lib/datetime';
import { moneyToString } from '@/lib/decimal';

import { workers } from '../fixtures';
import type { AttendanceStatus } from '../model';
import { computeWagesTotal, countPresent } from '../wages';
import { AttendanceRow } from './attendance-row';

// Provisional until the farm's timezone comes from the API — same caveat as
// the activity-log screen.
const FARM_TIME_ZONE = 'Asia/Karachi';

export interface AttendanceScreenProps {
  onClose: () => void;
  onSaved: () => void;
}

/**
 * Log Attendance (canvas `1a`, frame 9): a capture modal. UI-first — Save
 * returns to the screen it was opened from; persistence isn't wired yet
 * (see the ui-conventions plan). Plain component state, not RHF/Zod: this
 * is a roster to edit, not a form with invalid states — every worker always
 * has some status.
 */
export function AttendanceScreen({ onClose, onSaved }: AttendanceScreenProps) {
  const [statusById, setStatusById] = useState<
    Record<string, AttendanceStatus>
  >(() => Object.fromEntries(workers.map((w) => [w.id, w.defaultStatus])));

  const wagesToday = useMemo(
    () => moneyToString(computeWagesTotal(workers, statusById)),
    [statusById],
  );
  const present = useMemo(
    () => countPresent(workers, statusById),
    [statusById],
  );

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={`Today · ${formatInTimeZone(nowUtc(), FARM_TIME_ZONE, 'd MMM')}`}
        title="Attendance"
        onClose={onClose}
        right={
          <Text tone="accent" className="font-archivo-bold text-label">
            {present} / {workers.length}
          </Text>
        }
      />
      <ScrollView className="bg-neutral-0">
        {workers.map((worker) => (
          <AttendanceRow
            key={worker.id}
            worker={worker}
            status={statusById[worker.id] ?? worker.defaultStatus}
            onChange={(status) =>
              setStatusById((prev) => ({ ...prev, [worker.id]: status }))
            }
          />
        ))}
        <View className="flex-row items-baseline justify-between border-t-total border-ink bg-surface px-4 py-3.5">
          <MicroLabel>Wages today</MicroLabel>
          <Text className="font-archivo-bold text-heading">${wagesToday}</Text>
        </View>
      </ScrollView>
      <CaptureFooter>
        <Button title="Save attendance" haptic="success" onPress={onSaved} />
      </CaptureFooter>
    </Screen>
  );
}
