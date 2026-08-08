import { describe, expect, it } from '@jest/globals';

import type { Reminder } from './fixtures';
import { filterAndGroupReminders } from './group-reminders';

// A stand-in for a LucideIcon component. This "node" Jest project doesn't
// transform react-native/react-native-svg, so importing a real lucide icon
// here would break the suite — the icon's identity is irrelevant to this
// pure grouping/filtering logic anyway.
const FakeIcon = (() => null) as unknown as Reminder['Icon'];

function makeReminder(overrides: Partial<Reminder>): Reminder {
  return {
    id: 'r1',
    urgency: 'today',
    status: 'open',
    title: 'Test reminder',
    sub: 'sub',
    Icon: FakeIcon,
    critical: false,
    tagLabel: 'Today',
    tagVariant: 'accent',
    ...overrides,
  };
}

describe('filterAndGroupReminders', () => {
  const overdue = makeReminder({ id: 'r-overdue', urgency: 'overdue' });
  const today = makeReminder({ id: 'r-today', urgency: 'today' });
  const thisWeek = makeReminder({ id: 'r-week', urgency: 'thisWeek' });
  const done = makeReminder({ id: 'r-done', urgency: 'today', status: 'done' });
  const all = [overdue, today, thisWeek, done];

  it('"all" groups open reminders by urgency, in display order, omitting empty groups', () => {
    const groups = filterAndGroupReminders(all, 'all');
    expect(groups.map((g) => g.urgency)).toEqual([
      'overdue',
      'today',
      'thisWeek',
    ]);
    expect(groups.every((g) => g.items.length > 0)).toBe(true);
    expect(groups.flatMap((g) => g.items)).not.toContain(done);
  });

  it('"overdue" keeps only the overdue group', () => {
    const groups = filterAndGroupReminders(all, 'overdue');
    expect(groups).toHaveLength(1);
    expect(groups[0]?.urgency).toBe('overdue');
    expect(groups[0]?.items).toEqual([overdue]);
  });

  it('"done" shows only completed reminders, ignoring urgency filtering rules', () => {
    const groups = filterAndGroupReminders(all, 'done');
    expect(groups.flatMap((g) => g.items)).toEqual([done]);
  });

  it('returns no groups when nothing matches', () => {
    expect(filterAndGroupReminders([overdue, today], 'done')).toEqual([]);
  });
});
