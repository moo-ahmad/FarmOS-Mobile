import { ArrowRight } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { colors } from '@/theme';

interface HomeLinkProps {
  label: string;
  onPress: () => void;
}

function HomeLink({ label, onPress }: HomeLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-row items-center gap-1.5 py-1"
    >
      <Text tone="accent" className="font-archivo-bold text-label">
        {label}
      </Text>
      <ArrowRight size={15} color={colors.accent[700]} />
    </Pressable>
  );
}

export interface HomeLinksRowProps {
  onSeeAllActivity: () => void;
  onSeeAllFields: () => void;
}

/** "See all activity" / "See all fields" links below the active-cycles list. */
export function HomeLinksRow({
  onSeeAllActivity,
  onSeeAllFields,
}: HomeLinksRowProps) {
  return (
    <View className="flex-row gap-5 px-4 pb-1 pt-1">
      <HomeLink label="See all activity" onPress={onSeeAllActivity} />
      <HomeLink label="See all fields" onPress={onSeeAllFields} />
    </View>
  );
}
