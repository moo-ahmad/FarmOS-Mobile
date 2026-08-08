import { Box, Droplet, TriangleAlert } from 'lucide-react-native';
import { View } from 'react-native';

import { Tag, Text } from '@/components/ui';
import { colors } from '@/theme';

import type { AlertKind, AttentionAlert } from '../fixtures';

const ICON_BY_KIND: Record<AlertKind, typeof TriangleAlert> = {
  phi: TriangleAlert,
  irrigation: Droplet,
  reorder: Box,
};

export interface AttentionRowProps {
  alert: AttentionAlert;
}

/** One "needs attention" row: icon, message with the entity bolded, tag. */
export function AttentionRow({ alert }: AttentionRowProps) {
  const Icon = ICON_BY_KIND[alert.kind];
  const iconColor = alert.kind === 'phi' ? colors.accent.DEFAULT : colors.ink;

  return (
    <View className="flex-row items-center gap-3 px-4 py-3">
      <Icon size={20} color={iconColor} />
      <Text variant="body" className="flex-1">
        {alert.message}
        <Text variant="body" className="font-archivo-bold">
          {alert.emphasis}
        </Text>
      </Text>
      <Tag label={alert.tagLabel} variant={alert.tagVariant} />
    </View>
  );
}
