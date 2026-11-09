import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  AppHeader,
  Button,
  Screen,
  SegmentedControl,
  Text,
  type SegmentOption,
} from '@/components/ui';

import { seasons } from '../fixtures';
import type { SeasonFilter } from '../model';
import { filterSeasons } from '../season-display';
import { SeasonCard } from './season-card';

const FILTER_OPTIONS: readonly SegmentOption<SeasonFilter>[] = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Open' },
  { value: 'closed', label: 'Closed' },
];

export interface SeasonsScreenProps {
  onBack?: () => void;
  onNewSeason?: () => void;
  onViewSeason?: (seasonId: string) => void;
  onEditSeason?: (seasonId: string) => void;
  onCloseSeason?: (seasonId: string) => void;
}

/**
 * Seasons list (design handoff: "10 - Seasons", "Seasons list" frame): an
 * All/Open/Closed filter over season cards. Edit is disabled on closed seasons
 * and Close only appears on open ones. Backed by fixtures until the API
 * exposes seasons.
 */
export function SeasonsScreen({
  onBack,
  onNewSeason,
  onViewSeason,
  onEditSeason,
  onCloseSeason,
}: SeasonsScreenProps) {
  const [filter, setFilter] = useState<SeasonFilter>('all');
  const visible = useMemo(() => filterSeasons(seasons, filter), [filter]);

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`Setup · ${seasons.length} seasons`}
        title="Seasons"
        onBack={onBack}
      />
      <View className="px-4 pb-1 pt-3">
        <SegmentedControl
          options={FILTER_OPTIONS}
          value={filter}
          onChange={setFilter}
        />
      </View>
      <ScrollView
        className="bg-neutral-0"
        contentContainerClassName="gap-3 p-4"
      >
        {visible.length === 0 ? (
          <View className="items-center gap-1 px-8 py-12">
            <Text variant="row">No {filter} seasons</Text>
          </View>
        ) : (
          visible.map((season) => (
            <SeasonCard
              key={season.id}
              season={season}
              onView={() => onViewSeason?.(season.id)}
              onEdit={() => onEditSeason?.(season.id)}
              onClose={() => onCloseSeason?.(season.id)}
            />
          ))
        )}
      </ScrollView>
      <View className="border-t-hairline border-divider bg-neutral-0 px-4 py-3">
        <Button title="New season" onPress={onNewSeason} />
      </View>
    </Screen>
  );
}
