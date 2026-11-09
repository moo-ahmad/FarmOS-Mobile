import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import { useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  MicroLabel,
  Screen,
  SelectorRow,
  SquareBadge,
  Text,
} from '@/components/ui';
import { Fonts } from '@/constants/theme';
import { cn } from '@/lib/cn';
import { useFields } from '@/features/fields';
import { colors } from '@/theme';

import { cycleCode } from '../cycle-code';
import { crops, openSeasons } from '../fixtures';
import type { CropCycleFormValues } from '../model';
import { PickerSheet } from './picker-sheet';

export interface CropCycleFormScreenProps {
  onClose: () => void;
  onSave: (values: CropCycleFormValues) => void;
}

/**
 * New crop cycle (design handoff: "10 - Seasons", "Crop-cycle form" frame):
 * pick a field, a crop and an open season; the cycle code previews live as
 * field code + crop + the season's suffix. Fields come from `GET /api/fields`
 * (active only); crops and seasons are fixtures until the API exposes them.
 */
export function CropCycleFormScreen({
  onClose,
  onSave,
}: CropCycleFormScreenProps) {
  const fieldSheet = useRef<BottomSheetModal>(null);
  const cropSheet = useRef<BottomSheetModal>(null);

  const { data } = useFields();
  const fields = useMemo(
    () => (data?.fields ?? []).filter((f) => f.isActive),
    [data],
  );

  const [fieldId, setFieldId] = useState<number | null>(null);
  const [cropId, setCropId] = useState<string | null>(null);
  const [seasonId, setSeasonId] = useState<string | null>(
    openSeasons[0]?.id ?? null,
  );
  const [seasonsOpen, setSeasonsOpen] = useState(false);

  const field = fields.find((f) => f.fieldId === fieldId);
  const crop = crops.find((c) => c.id === cropId);
  const season = openSeasons.find((s) => s.id === seasonId);
  const code =
    field && crop && season ? cycleCode(field.code, crop, season) : null;

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="New entry"
        title="New crop cycle"
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <View className="gap-3.5 p-4">
          <View className="gap-1.5">
            <MicroLabel>Field</MicroLabel>
            <SelectorRow
              title={field ? field.name : 'Select a field'}
              sub={field ? `${field.areaAcres} ac` : undefined}
              badge={field ? <SquareBadge code={field.code} size={30} /> : null}
              onPress={() => fieldSheet.current?.present()}
            />
          </View>

          <View className="gap-1.5">
            <MicroLabel>Crop</MicroLabel>
            <SelectorRow
              title={crop ? crop.title : 'Select a crop'}
              onPress={() => cropSheet.current?.present()}
            />
          </View>

          <View className="gap-1.5">
            <MicroLabel>Season</MicroLabel>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: seasonsOpen }}
              onPress={() => setSeasonsOpen((open) => !open)}
              className={cn(
                'min-h-tap flex-row items-center gap-3 border-field bg-surface px-3 py-2.5',
                seasonsOpen ? 'border-ink' : 'border-divider',
              )}
            >
              <Text variant="row" className="flex-1">
                {season ? season.name : 'Select a season'}
              </Text>
              <ChevronDown size={20} color={colors.accent.DEFAULT} />
            </Pressable>
            {seasonsOpen ? (
              <View className="border-field border-ink">
                {openSeasons.map((s, index) => (
                  <Pressable
                    key={s.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected: s.id === seasonId }}
                    onPress={() => {
                      setSeasonId(s.id);
                      setSeasonsOpen(false);
                    }}
                    className={cn(
                      'min-h-tap flex-row items-center gap-3 px-3 py-2.5',
                      index > 0 && 'border-t-hairline border-divider',
                      s.id === seasonId && 'bg-accent-100',
                    )}
                  >
                    <View className="flex-1">
                      <Text variant="row">{s.name}</Text>
                      <Text variant="caption" tone="muted">
                        {s.kind} · {s.codeSuffix} · {s.startDate} → {s.endDate}
                      </Text>
                    </View>
                    {s.id === seasonId ? (
                      <Check size={18} color={colors.accent.DEFAULT} />
                    ) : null}
                  </Pressable>
                ))}
              </View>
            ) : null}
            <Text variant="caption" tone="muted">
              Only open seasons are listed. Closed seasons are hidden.
            </Text>
          </View>

          <View className="flex-row items-center justify-between border-field border-divider p-3">
            <MicroLabel>Cycle code</MicroLabel>
            <Text variant="label" style={{ fontFamily: Fonts?.mono }}>
              {code ?? '—'}
            </Text>
          </View>
        </View>
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save cycle"
          haptic="success"
          disabled={!code}
          onPress={() => {
            if (!field || !crop || !season || !code) return;
            onSave({
              fieldId: field.fieldId,
              fieldCode: field.code,
              cropId: crop.id,
              seasonId: season.id,
              cycleCode: code,
            });
          }}
        />
      </CaptureFooter>

      <PickerSheet
        ref={fieldSheet}
        title="Field"
        value={fieldId === null ? null : String(fieldId)}
        emptyMessage="No active fields yet. Add a field first."
        options={fields.map((f) => ({
          value: String(f.fieldId),
          label: f.name,
          sub: `${f.code} · ${f.areaAcres} ac`,
        }))}
        onSelect={(value) => {
          setFieldId(Number(value));
          fieldSheet.current?.dismiss();
        }}
      />
      <PickerSheet
        ref={cropSheet}
        title="Crop"
        value={cropId}
        options={crops.map((c) => ({ value: c.id, label: c.title }))}
        onSelect={(value) => {
          setCropId(value);
          cropSheet.current?.dismiss();
        }}
      />
    </Screen>
  );
}
