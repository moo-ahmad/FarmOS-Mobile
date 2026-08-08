import {
  Calendar,
  CircleCheckBig,
  Droplet,
  Package,
  TrendingUp,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

import type { TagVariant } from '@/components/ui';

import type { ReminderStatus, ReminderUrgency } from './model';

/**
 * Sample data for the Reminders screen (canvas `1a`, frame 3). Stands in for
 * the derived reminders domain (see src/features/home/fixtures.ts for the
 * same caveat) until the API exposes it.
 */
export interface Reminder {
  id: string;
  urgency: ReminderUrgency;
  status: ReminderStatus;
  title: string;
  sub: string;
  Icon: LucideIcon;
  /** Icon renders red for overdue/critical items, ink otherwise. */
  critical: boolean;
  tagLabel: string;
  tagVariant: TagVariant;
  /** Set when this reminder references a specific field — makes the row tappable. */
  fieldCode?: string;
}

export const reminders: Reminder[] = [
  {
    id: 'reminder-irrigation',
    urgency: 'overdue',
    status: 'open',
    title: 'Irrigation due',
    sub: 'F1 Cotton · 2 days late',
    Icon: Droplet,
    critical: true,
    tagLabel: '−2d',
    tagVariant: 'solid',
    fieldCode: 'F1',
  },
  {
    id: 'reminder-wages',
    urgency: 'overdue',
    status: 'open',
    title: 'Wage payment due',
    sub: '4 seasonal workers · week 15',
    Icon: Users,
    critical: true,
    tagLabel: '−1d',
    tagVariant: 'solid',
  },
  {
    id: 'reminder-safe-harvest',
    urgency: 'today',
    status: 'open',
    title: 'Safe-harvest date reached',
    sub: 'F3 Wheat · PHI elapsed',
    Icon: TriangleAlert,
    critical: false,
    tagLabel: 'Today',
    tagVariant: 'accent',
    fieldCode: 'F3',
  },
  {
    id: 'reminder-reorder',
    urgency: 'today',
    status: 'open',
    title: 'Reorder input',
    sub: 'Urea below reorder level',
    Icon: Package,
    critical: false,
    tagLabel: 'Today',
    tagVariant: 'accent',
  },
  {
    id: 'reminder-fertilizer',
    urgency: 'today',
    status: 'open',
    title: 'Fertilizer split dose',
    sub: 'F1 Cotton · 2nd N application',
    Icon: Calendar,
    critical: false,
    tagLabel: 'Today',
    tagVariant: 'accent',
    fieldCode: 'F1',
  },
  {
    id: 'reminder-machinery',
    urgency: 'thisWeek',
    status: 'open',
    title: 'Machinery service',
    sub: 'Tractor MF-260 · 50h due',
    Icon: TrendingUp,
    critical: false,
    tagLabel: 'Fri',
    tagVariant: 'neutral',
  },
  {
    id: 'reminder-harvest-window',
    urgency: 'thisWeek',
    status: 'open',
    title: 'Harvest window opens',
    sub: 'F3 Wheat · maturity −7d',
    Icon: CircleCheckBig,
    critical: false,
    tagLabel: 'Sun',
    tagVariant: 'neutral',
    fieldCode: 'F3',
  },
];
