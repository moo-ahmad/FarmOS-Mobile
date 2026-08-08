import { addMoney, scaleMoney, ZERO_MONEY, type Money } from '@/lib/decimal';

import type { Worker } from './fixtures';
import { ATTENDANCE_MULTIPLIER, type AttendanceStatus } from './model';

/** Total wages for today, given each worker's status. */
export function computeWagesTotal(
  workers: readonly Worker[],
  statusById: Readonly<Record<string, AttendanceStatus>>,
): Money {
  return workers.reduce((total, worker) => {
    const status = statusById[worker.id] ?? 'absent';
    return addMoney(
      total,
      scaleMoney(worker.dailyRate, ATTENDANCE_MULTIPLIER[status]),
    );
  }, ZERO_MONEY);
}

/** How many workers are marked present (full or half) out of the roster. */
export function countPresent(
  workers: readonly Worker[],
  statusById: Readonly<Record<string, AttendanceStatus>>,
): number {
  return workers.filter((w) => (statusById[w.id] ?? 'absent') !== 'absent')
    .length;
}
