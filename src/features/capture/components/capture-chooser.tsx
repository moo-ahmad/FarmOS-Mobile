import {
  ChevronRight,
  Droplet,
  Receipt,
  UserCheck,
  Wheat,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { CaptureHeader, Divider, Screen, Text } from '@/components/ui';
import { colors } from '@/theme';

export type CaptureKind = 'activity' | 'harvest' | 'expense' | 'attendance';

interface ChooserOption {
  kind: CaptureKind;
  label: string;
  Icon: LucideIcon;
}

const OPTIONS: ChooserOption[] = [
  { kind: 'activity', label: 'Log activity', Icon: Droplet },
  { kind: 'harvest', label: 'Log harvest', Icon: Wheat },
  { kind: 'expense', label: 'Log expense', Icon: Receipt },
  { kind: 'attendance', label: 'Log attendance', Icon: UserCheck },
];

export interface CaptureChooserProps {
  onClose: () => void;
  onSelect: (kind: CaptureKind) => void;
}

/**
 * Quick-capture chooser: the shared entry point for the four capture modals,
 * opened from the bottom nav's center FAB. Not one of the 10 designed
 * screens in the handoff — no canvas markup exists for it, so this is built
 * from the same Modernist primitives rather than a pixel-matched design.
 */
export function CaptureChooser({ onClose, onSelect }: CaptureChooserProps) {
  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker="Quick capture"
        title="New entry"
        onClose={onClose}
      />
      <View>
        {OPTIONS.map((option, index) => (
          <View key={option.kind}>
            <Pressable
              accessibilityRole="button"
              onPress={() => onSelect(option.kind)}
              className="min-h-tap flex-row items-center gap-3 px-4 py-4"
            >
              <option.Icon size={22} color={colors.ink} strokeWidth={1.9} />
              <Text variant="row" className="flex-1">
                {option.label}
              </Text>
              <ChevronRight
                size={20}
                color={colors.accent.DEFAULT}
                strokeWidth={2}
              />
            </Pressable>
            {index < OPTIONS.length - 1 ? <Divider className="mx-4" /> : null}
          </View>
        ))}
      </View>
    </Screen>
  );
}
