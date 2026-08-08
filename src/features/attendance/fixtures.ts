import { toMoney, type Money } from '@/lib/decimal';

import type { AttendanceStatus } from './model';

/**
 * Sample workers and today's starting attendance (canvas `1a`, frame 9).
 * Stands in for the workers domain until the API exposes it — same caveat as
 * src/features/home/fixtures.ts.
 */
export interface Worker {
  id: string;
  initials: string;
  name: string;
  employment: string;
  dailyRate: Money;
  /** The status shown pre-filled in the mock. */
  defaultStatus: AttendanceStatus;
}

export const workers: Worker[] = [
  {
    id: 'worker-aslam',
    initials: 'AS',
    name: 'Aslam Khan',
    employment: 'Permanent',
    dailyRate: toMoney('12'),
    defaultStatus: 'full',
  },
  {
    id: 'worker-bashir',
    initials: 'BA',
    name: 'Bashir Ahmed',
    employment: 'Seasonal',
    dailyRate: toMoney('9'),
    defaultStatus: 'full',
  },
  {
    id: 'worker-farid',
    initials: 'FA',
    name: 'Farid Masih',
    employment: 'Daily wage',
    dailyRate: toMoney('9'),
    defaultStatus: 'half',
  },
  {
    id: 'worker-kamran',
    initials: 'KA',
    name: 'Kamran Ali',
    employment: 'Daily wage',
    dailyRate: toMoney('9'),
    defaultStatus: 'absent',
  },
];
