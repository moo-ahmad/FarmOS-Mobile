import { Plus } from 'lucide-react-native';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { AppHeader, Divider, Screen } from '@/components/ui';
import { colors } from '@/theme';

import { fields } from '../fixtures';
import { FieldMap } from './field-map';
import { FieldRow } from './field-row';

export interface FieldsScreenProps {
  onAddField?: () => void;
  onOpenField?: (fieldCode: string) => void;
  /** The field the user arrived to see, e.g. from a Home cycle row or a reminder. */
  focusCode?: string;
}

/**
 * Fields (design handoff: FarmOS Land, "Fields" frame): a schematic parcel
 * map plus the field list. Built against sample fixtures — see ../fixtures.
 */
export function FieldsScreen({
  onAddField,
  onOpenField,
  focusCode,
}: FieldsScreenProps) {
  const totalHa = useMemo(
    () => fields.reduce((sum, f) => sum + f.areaHa, 0).toFixed(1),
    [],
  );

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`${fields.length} fields · ${totalHa} ha`}
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
        <FieldMap fields={fields} focusCode={focusCode} />
        {fields.map((field, index) => (
          <View key={field.id}>
            <FieldRow
              field={field}
              highlighted={field.code === focusCode}
              onPress={() => onOpenField?.(field.code)}
            />
            {index < fields.length - 1 ? <Divider className="mx-4" /> : null}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
