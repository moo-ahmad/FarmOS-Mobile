import { View } from 'react-native';

import { cn } from '@/lib/cn';

/** 2.5px solid-ink section rule — the primary structural break. */
export function Rule({ className }: { className?: string }) {
  return <View className={cn('border-t-rule border-ink', className)} />;
}

/** 1px hairline divider between rows within a section. */
export function Divider({ className }: { className?: string }) {
  return <View className={cn('border-t-hairline border-divider', className)} />;
}

/** 2px ink rule used above totals. */
export function TotalRule({ className }: { className?: string }) {
  return <View className={cn('border-t-total border-ink', className)} />;
}
