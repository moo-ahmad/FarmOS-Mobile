/** Reminders domain vocabulary. */

export type ReminderUrgency = 'overdue' | 'today' | 'thisWeek';
export type ReminderStatus = 'open' | 'done';

export const REMINDER_FILTERS = ['all', 'overdue', 'done'] as const;
export type ReminderFilter = (typeof REMINDER_FILTERS)[number];

/** Group display order and label, keyed by urgency. */
export const URGENCY_LABEL: Record<ReminderUrgency, string> = {
  overdue: 'Overdue',
  today: 'Today',
  thisWeek: 'This week',
};

export const URGENCY_ORDER: ReminderUrgency[] = [
  'overdue',
  'today',
  'thisWeek',
];
