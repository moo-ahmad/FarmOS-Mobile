import { Calendar, TriangleAlert } from 'lucide-react-native';
import { type ReactNode, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import {
  Button,
  Callout,
  CaptureFooter,
  CaptureHeader,
  MicroLabel,
  Screen,
  SegmentedControl,
  Text,
  TextField,
  type SegmentOption,
} from '@/components/ui';
import { Fonts } from '@/constants/theme';
import { colors } from '@/theme';

import {
  SEASON_KINDS,
  type ExistingSeason,
  type SeasonFormValues,
  type SeasonKind,
} from '../model';
import {
  codeSuffix,
  defaultDates,
  durationDays,
  findOverlap,
  suggestName,
  validateSeason,
} from '../season-rules';

const KIND_OPTIONS: readonly SegmentOption<SeasonKind>[] = SEASON_KINDS.map(
  (kind) => ({ value: kind, label: kind }),
);

export interface SeasonFormScreenProps {
  /** Present when editing; absent for a new season. */
  season?: ExistingSeason;
  /** The farm's seasons, for the duplicate-name and overlap checks. */
  existingSeasons: readonly ExistingSeason[];
  onClose: () => void;
  onSave: (values: SeasonFormValues) => void;
  /** True while the save request is in flight. */
  saving?: boolean;
  /** A failed save's message (e.g. the backend's validation error). */
  errorMessage?: string;
}

function PreviewRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <MicroLabel>{label}</MicroLabel>
      {children}
    </View>
  );
}

function Mono({ children }: { children: string }) {
  return (
    <Text variant="label" style={{ fontFamily: Fonts?.mono }}>
      {children}
    </Text>
  );
}

/**
 * New / edit season (design handoff: "10 - Seasons", "New / edit season"
 * frames). Picking a type pre-fills typical dates and a suggested name until
 * the user edits them; the preview updates live. Overlap with a same-type
 * season only warns; invalid dates or a duplicate name block Save. A closed
 * season opens read-only. Checks run against the `existingSeasons` the
 * route passes in.
 */
export function SeasonFormScreen({
  season,
  existingSeasons,
  onClose,
  onSave,
  saving = false,
  errorMessage,
}: SeasonFormScreenProps) {
  const isEdit = season !== undefined;
  const isClosed = season?.status === 'closed';

  const [kind, setKind] = useState<SeasonKind>(season?.kind ?? 'Rabi');
  const [name, setName] = useState(() =>
    season
      ? season.name
      : suggestName(
          'Rabi',
          defaultDates('Rabi', new Date().getFullYear()).startDate,
        ),
  );
  const [startDate, setStartDate] = useState(
    () =>
      season?.startDate ??
      defaultDates('Rabi', new Date().getFullYear()).startDate,
  );
  const [endDate, setEndDate] = useState(
    () =>
      season?.endDate ?? defaultDates('Rabi', new Date().getFullYear()).endDate,
  );
  const [nameEdited, setNameEdited] = useState(isEdit);
  const [datesEdited, setDatesEdited] = useState(isEdit);

  const values: SeasonFormValues = { kind, name, startDate, endDate };
  const errors = useMemo(
    () => validateSeason(values, existingSeasons, season?.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, name, startDate, endDate, season?.id, existingSeasons],
  );
  const overlap = useMemo(
    () => findOverlap(existingSeasons, values, season?.id),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [kind, startDate, endDate, season?.id, existingSeasons],
  );
  const hasErrors = Object.keys(errors).length > 0;
  const dateError = errors.startDate ?? errors.endDate;
  const duration = durationDays(startDate, endDate);
  const suffix = codeSuffix(kind, name, startDate);

  const handleKind = (next: SeasonKind) => {
    setKind(next);
    let nextStart = startDate;
    if (!datesEdited) {
      const dates = defaultDates(next, new Date().getFullYear());
      nextStart = dates.startDate;
      setStartDate(dates.startDate);
      setEndDate(dates.endDate);
    }
    if (!nameEdited) setName(suggestName(next, nextStart));
  };

  const handleStart = (text: string) => {
    setStartDate(text);
    setDatesEdited(true);
    if (!nameEdited && durationDays(text, text) !== null) {
      setName(suggestName(kind, text));
    }
  };

  const handleEnd = (text: string) => {
    setEndDate(text);
    setDatesEdited(true);
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={isClosed ? 'Closed season' : isEdit ? 'Season' : 'New entry'}
        title={isEdit ? 'Edit season' : 'New season'}
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <View className="gap-3.5 p-4">
          {isClosed ? <Callout>Cannot edit a closed season.</Callout> : null}

          <View
            pointerEvents={isClosed ? 'none' : 'auto'}
            className={isClosed ? 'gap-3.5 opacity-60' : 'gap-3.5'}
          >
            <View className="gap-1.5">
              <MicroLabel>Season type</MicroLabel>
              <SegmentedControl
                options={KIND_OPTIONS}
                value={kind}
                onChange={handleKind}
              />
              <Text variant="caption" tone="muted">
                Picking a type pre-fills typical dates until you change them.
              </Text>
            </View>

            <View className="gap-1.5">
              <TextField
                label="Name"
                value={name}
                editable={!isClosed}
                onChangeText={(text) => {
                  setName(text);
                  setNameEdited(true);
                }}
                error={errors.name}
              />
              {errors.name ? null : (
                <Text variant="caption" tone="muted">
                  Suggested from type + years. Edit to override.
                </Text>
              )}
            </View>

            <View className="flex-row gap-2.5">
              <TextField
                label="Start date"
                value={startDate}
                editable={!isClosed}
                onChangeText={handleStart}
                keyboardType="numbers-and-punctuation"
                placeholder="YYYY-MM-DD"
                maxLength={10}
                error={errors.startDate}
                containerClassName="flex-1"
                trailing={<Calendar size={18} color={colors.neutral[500]} />}
              />
              <TextField
                label="End date"
                value={endDate}
                editable={!isClosed}
                onChangeText={handleEnd}
                keyboardType="numbers-and-punctuation"
                placeholder="YYYY-MM-DD"
                maxLength={10}
                error={errors.endDate}
                containerClassName="flex-1"
                trailing={<Calendar size={18} color={colors.neutral[500]} />}
              />
            </View>
          </View>

          <View className="border-field border-divider p-3">
            <MicroLabel>Live preview</MicroLabel>
            <PreviewRow label="Duration">
              <Text variant="label">
                {duration === null ? '—' : `${duration} days`}
              </Text>
            </PreviewRow>
            <PreviewRow label="Cycle-code suffix">
              <Mono>{suffix}</Mono>
            </PreviewRow>
            {isClosed ? (
              <PreviewRow label="Status">
                <Text variant="label">Closed</Text>
              </PreviewRow>
            ) : hasErrors ? null : (
              <PreviewRow label="Example">
                <Mono>{`F1-WHEAT-${suffix}`}</Mono>
              </PreviewRow>
            )}
            {isClosed ? null : dateError ? (
              <Callout className="mt-2.5">
                {dateError} Fix the dates to save.
              </Callout>
            ) : overlap ? (
              <View className="mt-2.5 flex-row items-start gap-2 border-field border-ink bg-neutral-100 px-3 py-2.5">
                <TriangleAlert size={16} color={colors.ink} />
                <Text variant="caption" className="flex-1">
                  <Text variant="caption" className="font-archivo-bold">
                    Overlaps {overlap.name}
                  </Text>{' '}
                  ({overlap.startDate} → {overlap.endDate}). You can still save.
                </Text>
              </View>
            ) : (
              <PreviewRow label="Overlap">
                <Text variant="label">None with other {kind} seasons</Text>
              </PreviewRow>
            )}
          </View>
          {errorMessage ? <Callout>{errorMessage}</Callout> : null}
        </View>
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save season"
          haptic="success"
          disabled={isClosed || hasErrors}
          loading={saving}
          onPress={() => onSave({ ...values, name: name.trim() })}
        />
      </CaptureFooter>
    </Screen>
  );
}
