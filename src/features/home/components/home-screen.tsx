import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { AppHeader, Divider, Screen } from '@/components/ui';
import { useSignOut } from '@/features/auth';
import { colors } from '@/theme';

import {
  attentionAlerts,
  cropCycles,
  homeSummary,
  incomeExpenseByMonth,
} from '../fixtures';
import { AttentionRow } from './attention-row';
import { ChartLegend } from './chart-legend';
import { CycleRow } from './cycle-row';
import { IncomeExpenseChart } from './income-expense-chart';
import { NetCashSummary } from './net-cash-summary';
import { SectionHeader } from './section-header';

export interface HomeScreenProps {
  onOpenCycle?: (cycleId: string) => void;
}

/**
 * Home (canvas `1a`, frame 1): glance-first daily overview. Built against the
 * sample fixtures in ../fixtures until the cycles/reminders API exists.
 */
export function HomeScreen({ onOpenCycle }: HomeScreenProps) {
  const { t } = useTranslation();
  const signOut = useSignOut();

  const confirmLogout = () => {
    Alert.alert(t('home.logoutConfirmTitle'), t('home.logoutConfirmMessage'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.logout'),
        style: 'destructive',
        onPress: () => signOut.mutate(),
      },
    ]);
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker="Greenfield Farms"
        title="Today"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('common.logout')}
            disabled={signOut.isPending}
            onPress={confirmLogout}
          >
            <LogOut size={22} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <NetCashSummary
          month={homeSummary.month}
          netCash={homeSummary.netCash}
          moneyIn={homeSummary.moneyIn}
          moneyOut={homeSummary.moneyOut}
        />
        <Divider />

        <SectionHeader
          label="Active crop cycles"
          trailing={String(cropCycles.length)}
        />
        {cropCycles.map((cycle, index) => (
          <View key={cycle.id}>
            <CycleRow cycle={cycle} onPress={() => onOpenCycle?.(cycle.id)} />
            {index < cropCycles.length - 1 ? (
              <Divider className="mx-4" />
            ) : null}
          </View>
        ))}
        <Divider />

        <SectionHeader label="Income vs expense · 6 mo" />
        <View className="items-center px-4 pb-1 pt-2">
          <IncomeExpenseChart data={incomeExpenseByMonth} />
        </View>
        <ChartLegend />
        <Divider />

        <SectionHeader label="Needs attention" />
        {attentionAlerts.map((alert, index) => (
          <View key={alert.id}>
            <AttentionRow alert={alert} />
            {index < attentionAlerts.length - 1 ? (
              <Divider className="mx-4" />
            ) : null}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
