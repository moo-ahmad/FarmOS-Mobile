import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Divider,
  Kicker,
  Screen,
  SegmentedControl,
  Text,
} from '@/components/ui';

import { reminders as allReminders } from '../fixtures';
import { filterAndGroupReminders } from '../group-reminders';
import { REMINDER_FILTERS, URGENCY_LABEL, type ReminderFilter } from '../model';
import { GroupHeader } from './group-header';
import { ReminderRow } from './reminder-row';

const FILTER_OPTIONS = REMINDER_FILTERS.map((value) => ({
  value,
  label: value === 'all' ? 'All' : value === 'overdue' ? 'Overdue' : 'Done',
}));

/**
 * Reminders (canvas `1a`, frame 3): everything time-sensitive, grouped by
 * urgency, filterable via the All/Overdue/Done segmented control. Built
 * against sample fixtures — see ../fixtures.
 *
 * The header doesn't use the shared AppHeader: the design nests the
 * segmented control inside the same bordered header block as the title
 * (one 2.5px bottom rule for both), which AppHeader's single-row shape
 * can't express.
 */
export function RemindersScreen() {
  const [filter, setFilter] = useState<ReminderFilter>('all');
  const openCount = useMemo(
    () => allReminders.filter((r) => r.status === 'open').length,
    [],
  );

  const groups = useMemo(
    () => filterAndGroupReminders(allReminders, filter),
    [filter],
  );

  const isEmpty = groups.length === 0;

  return (
    <Screen edgeToEdgeBottom={false}>
      <View className="border-b-rule border-ink bg-neutral-0 px-4 py-3">
        <Kicker>{openCount} open</Kicker>
        <Text variant="title">Reminders</Text>
        <SegmentedControl
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
          className="mt-3"
        />
      </View>
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isEmpty ? (
          <Text tone="muted" className="px-4 py-6 text-center">
            {filter === 'done'
              ? 'No completed reminders yet.'
              : 'Nothing here.'}
          </Text>
        ) : (
          groups.map((group, groupIndex) => (
            <View key={group.urgency}>
              <GroupHeader
                label={URGENCY_LABEL[group.urgency]}
                count={group.items.length}
                emphasis={group.urgency === 'overdue'}
              />
              {group.items.map((item, index) => {
                // Every row gets a divider except the very last row of the
                // very last group — matches the design (dividers run across
                // group boundaries too, not just within a group).
                const isLastOverall =
                  groupIndex === groups.length - 1 &&
                  index === group.items.length - 1;
                return (
                  <View key={item.id}>
                    <ReminderRow reminder={item} />
                    {isLastOverall ? null : <Divider className="mx-4" />}
                  </View>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
