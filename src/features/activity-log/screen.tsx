import { FlashList } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Screen, Text } from '@/components/ui';
import type { ActivityLogRow } from '@/db/schema';
import { formatInTimeZone } from '@/lib/datetime';
import { getCurrentFarmId } from '@/lib/farm';

import { ActivityLogForm } from './components/activity-log-form';
import { useActivityLogs, useCreateActivityLog } from './hooks';

// Provisional until the farm's timezone comes from the API.
const FARM_TIME_ZONE = 'Asia/Karachi';

function ActivityLogItem({ log }: { log: ActivityLogRow }) {
  const { t } = useTranslation();
  return (
    <View className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-800">
      <View className="flex-row items-center justify-between">
        <Text variant="label">{t(`activity.types.${log.activityType}`)}</Text>
        <Text variant="body">
          {log.quantity} {log.unit}
        </Text>
      </View>
      <View className="mt-1 flex-row items-center justify-between">
        <Text variant="caption" tone="muted">
          {formatInTimeZone(log.occurredAt, FARM_TIME_ZONE)}
          {log.cost ? ` · ${log.cost}` : ''}
        </Text>
        {log.syncedAt ? null : (
          <Text variant="caption" tone="accent">
            {t('activity.pending')}
          </Text>
        )}
      </View>
      {log.notes ? (
        <Text variant="caption" tone="muted" className="mt-1">
          {log.notes}
        </Text>
      ) : null}
    </View>
  );
}

export function ActivityLogScreen() {
  const { t } = useTranslation();
  const farmId = getCurrentFarmId();
  const { data } = useActivityLogs(farmId);
  const create = useCreateActivityLog(farmId);

  return (
    <Screen>
      <FlashList
        data={data ?? []}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="gap-4 py-4">
            <Text variant="title">{t('activity.title')}</Text>
            <ActivityLogForm
              onSubmit={(values) => create.mutate(values)}
              submitting={create.isPending}
            />
            <Text variant="heading">{t('activity.recent')}</Text>
          </View>
        }
        ListEmptyComponent={<Text tone="muted">{t('activity.empty')}</Text>}
        ItemSeparatorComponent={() => <View className="h-2" />}
        renderItem={({ item }) => <ActivityLogItem log={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </Screen>
  );
}
