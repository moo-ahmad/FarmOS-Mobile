import type { Reminder } from './fixtures';
import {
  URGENCY_ORDER,
  type ReminderFilter,
  type ReminderUrgency,
} from './model';

export interface ReminderGroup {
  urgency: ReminderUrgency;
  items: Reminder[];
}

/**
 * Apply the All/Overdue/Done filter, then group the result by urgency in
 * display order. Empty groups are omitted. Pure so it can be unit-tested
 * without rendering the screen.
 */
export function filterAndGroupReminders(
  reminders: readonly Reminder[],
  filter: ReminderFilter,
): ReminderGroup[] {
  const base = reminders.filter((r) =>
    filter === 'done' ? r.status === 'done' : r.status === 'open',
  );
  const filtered =
    filter === 'overdue' ? base.filter((r) => r.urgency === 'overdue') : base;

  return URGENCY_ORDER.map((urgency) => ({
    urgency,
    items: filtered.filter((r) => r.urgency === urgency),
  })).filter((group) => group.items.length > 0);
}
