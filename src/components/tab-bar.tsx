import { router, usePathname, type Href } from 'expo-router';
import {
  Bell,
  Home,
  Package,
  Plus,
  Sprout,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import { cropCycles } from '@/features/home';
import { colors } from '@/theme';

interface TabItem {
  key: string;
  href: Href;
  label: string;
  Icon: LucideIcon;
  /** Matches any pathname under this prefix (e.g. the per-cycle Crop P&L route). */
  activePrefix?: string;
}

const LEFT_TABS: TabItem[] = [
  { key: 'home', href: '/', label: 'Home', Icon: Home },
  {
    key: 'cycles',
    href: `/crop-pnl/${cropCycles[0]?.id ?? ''}` as Href,
    label: 'Cycles',
    Icon: Sprout,
    activePrefix: '/crop-pnl',
  },
];

const RIGHT_TABS: TabItem[] = [
  { key: 'stock', href: '/stock', label: 'Stock', Icon: Package },
  { key: 'alerts', href: '/alerts', label: 'Alerts', Icon: Bell },
];

const INACTIVE_COLOR = 'rgba(32,30,29,0.45)'; // ink @ 45%, matches the design spec

interface TabProps {
  item: TabItem;
  active: boolean;
}

/** One labelled tab slot: icon over an 8.5px label, red + top indicator when active. */
function Tab({ item, active }: TabProps) {
  const { Icon, label, href } = item;
  const color = active ? colors.accent.DEFAULT : INACTIVE_COLOR;

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={() => {
        if (!active) router.replace(href);
      }}
      className="min-h-tap flex-1 items-center justify-center gap-[3px] pb-[11px] pt-[9px]"
    >
      {active ? (
        <View className="absolute left-[26%] right-[26%] top-0 h-[3px] bg-accent" />
      ) : null}
      <Icon size={22} color={color} strokeWidth={1.9} />
      <Text
        style={{ color }}
        className="font-archivo-medium text-[8.5px] tracking-[0.03em]"
      >
        {label}
      </Text>
    </Pressable>
  );
}

/** Center quick-capture slot: a 44×44 red square, no label — not a route tab. */
function CaptureFab() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Quick capture"
      onPress={() => router.push('/capture')}
      className="flex-1 items-center justify-center"
    >
      <View className="-mt-0.5 h-11 w-11 items-center justify-center bg-accent">
        <Plus size={24} color={colors.white} strokeWidth={2.2} />
      </View>
    </Pressable>
  );
}

/**
 * Modernist bottom tab bar: Home · Cycles · [red FAB] · Stock · Alerts. White,
 * 2.5px solid-ink top border; active tab is red with a 3px red top indicator;
 * the center slot is a 44×44 red square (quick-capture), not a labeled tab.
 *
 * Built as a plain component (not React Navigation's tabBar customization)
 * since the center FAB isn't a route — pressing it opens the quick-capture
 * chooser modal and never becomes "active". Tab presses use router.replace so
 * switching tabs doesn't grow the back stack.
 */
export function TabBar() {
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row border-t-rule border-ink bg-neutral-0"
      style={{ paddingBottom: insets.bottom }}
    >
      {LEFT_TABS.map((item) => (
        <Tab
          key={item.key}
          item={item}
          active={
            item.activePrefix
              ? pathname.startsWith(item.activePrefix)
              : pathname === item.href
          }
        />
      ))}
      <CaptureFab />
      {RIGHT_TABS.map((item) => (
        <Tab key={item.key} item={item} active={pathname === item.href} />
      ))}
    </View>
  );
}
