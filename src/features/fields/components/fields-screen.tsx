import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import { AppHeader, Callout, Divider, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

import { useFields } from '../hooks';
import { FieldRow } from './field-row';

export interface FieldsScreenProps {
  onAddField?: () => void;
  onOpenField?: (fieldCode: string) => void;
  /** The field the user arrived to see, e.g. from a Home cycle row or a reminder. */
  focusCode?: string;
}

/**
 * Fields (design handoff: FarmOS Land, "Fields" frame): the field list,
 * wired to `GET /api/fields`. Drops the handoff's schematic 4-parcel map —
 * that diagram's layout was fixed to exactly 4 demo fields and can't
 * generalize to a real, dynamically-sized field list. Only active fields are
 * shown, matching the Deactivate action's promise to hide a field "from
 * active lists".
 */
export function FieldsScreen({
  onAddField,
  onOpenField,
  focusCode,
}: FieldsScreenProps) {
  const { data, isPending, isError, refetch } = useFields();

  const activeFields = useMemo(
    () => (data?.fields ?? []).filter((field) => field.isActive),
    [data],
  );
  const totalAcres = useMemo(
    () => activeFields.reduce((sum, f) => sum + f.areaAcres, 0).toFixed(1),
    [activeFields],
  );

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`${activeFields.length} fields · ${totalAcres} ac`}
        title="Fields"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add field"
            onPress={onAddField}
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
            Couldn&apos;t load fields.{' '}
            <Text
              tone="accent"
              className="font-archivo-bold"
              onPress={() => refetch()}
            >
              Retry
            </Text>
          </Callout>
        ) : activeFields.length === 0 ? (
          <View className="items-center gap-1 px-8 py-12">
            <Text variant="row">No active fields yet</Text>
            <Text variant="caption" tone="muted" className="text-center">
              Add your first field to start tracking it here.
            </Text>
          </View>
        ) : (
          activeFields.map((field, index) => (
            <View key={field.fieldId}>
              <FieldRow
                field={field}
                highlighted={field.code === focusCode}
                onPress={() => onOpenField?.(field.code)}
              />
              {index < activeFields.length - 1 ? (
                <Divider className="mx-4" />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
