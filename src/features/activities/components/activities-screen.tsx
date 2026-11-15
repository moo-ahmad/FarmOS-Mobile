import { ChevronRight, Plus } from 'lucide-react-native';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Callout,
  Divider,
  Screen,
  Tag,
  Text,
} from '@/components/ui';
import { useCropCycles, useCycleNames } from '@/features/crop-cycles';
import type { ActivityDto } from '@/lib/activities';
import { colors } from '@/theme';

import { apiCostLabel } from '../costs';
import { useActivities } from '../hooks';
import {
  ActivityStatus,
  activityStatusLabel,
  activityTypeLabel,
} from '../model';

export interface ActivitiesScreenProps {
  /** Only this crop cycle's activities (opened from the cycle's detail). */
  cropCycleId?: number;
  onBack?: () => void;
  onLogActivity: () => void;
  onOpenActivity: (activityId: number) => void;
}

function ActivityRow({
  activity,
  where,
  onPress,
}: {
  activity: ActivityDto;
  where: string | undefined;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1 gap-0.5">
        <Text variant="row">{activity.title}</Text>
        <Text variant="caption" tone="muted">
          {[
            activity.activityDate,
            activityTypeLabel(activity.activityType),
            where,
          ]
            .filter(Boolean)
            .join(' · ')}
        </Text>
      </View>
      <View className="items-end gap-1">
        <Text className="font-archivo-bold text-label">
          {apiCostLabel(activity.totalCost)}
        </Text>
        {activity.status === ActivityStatus.Done ? null : (
          <Tag label={activityStatusLabel(activity.status)} />
        )}
      </View>
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}

/**
 * Activity log: every (non-void) activity on the farm, newest first, wired to
 * `GET /api/activities` — or one crop cycle's, when opened from it.
 */
export function ActivitiesScreen({
  cropCycleId,
  onBack,
  onLogActivity,
  onOpenActivity,
}: ActivitiesScreenProps) {
  const { data, isPending, isError, refetch } = useActivities({ cropCycleId });
  const cycles = useCropCycles();
  const names = useCycleNames();
  const activities = data ?? [];
  const cycleCode = (id: number | null) =>
    cycles.data?.find((c) => c.cropCycleId === id)?.cycleCode;

  const where = (activity: ActivityDto) => {
    if (cropCycleId !== undefined) return undefined;
    if (activity.cropCycleId !== null) return cycleCode(activity.cropCycleId);
    if (activity.fieldId !== null) return names.field(activity.fieldId);
    return activity.isFarmLevel ? 'Whole farm' : undefined;
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={
          cropCycleId === undefined
            ? `${activities.length} logged`
            : (cycleCode(cropCycleId) ?? 'Crop cycle')
        }
        title="Activities"
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log activity"
            hitSlop={12}
            onPress={onLogActivity}
          >
            <Plus size={24} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
        }
      />
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isPending ? (
          <View className="items-center py-12">
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : isError ? (
          <Callout className="m-4">
            Couldn&apos;t load activities.{' '}
            <Text
              tone="accent"
              className="font-archivo-bold"
              onPress={() => refetch()}
            >
              Retry
            </Text>
          </Callout>
        ) : activities.length === 0 ? (
          <View className="items-center gap-1 px-8 py-12">
            <Text variant="row">No activities yet</Text>
            <Text variant="caption" tone="muted" className="text-center">
              Log irrigation, sprays, fertilizer and field work — with the
              inputs, labor and machinery used — so each crop&apos;s real cost
              adds up.
            </Text>
          </View>
        ) : (
          activities.map((activity, index) => (
            <View key={activity.activityId}>
              <ActivityRow
                activity={activity}
                where={where(activity)}
                onPress={() => onOpenActivity(activity.activityId)}
              />
              {index < activities.length - 1 ? (
                <Divider className="mx-4" />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
