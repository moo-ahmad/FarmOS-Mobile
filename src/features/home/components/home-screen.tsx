import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, View } from 'react-native';

import { AppHeader, Divider, Screen } from '@/components/ui';
import { useSignOut } from '@/features/auth';
import { useCustomers } from '@/features/customers';
import { SetupCard } from '@/features/farm-setup';
import { useSeasons } from '@/features/season-form';
import { useWorkers } from '@/features/workers';
import { colors } from '@/theme';

import {
  attentionAlerts,
  cropCycles,
  homeSummary,
  incomeExpenseByMonth,
  teamSummary,
} from '../fixtures';
import { AttentionRow } from './attention-row';
import { ChartLegend } from './chart-legend';
import { CustomersRow } from './customers-row';
import { CycleRow } from './cycle-row';
import { HomeLinksRow } from './home-links-row';
import { IncomeExpenseChart } from './income-expense-chart';
import { NetCashSummary } from './net-cash-summary';
import { SeasonsRow } from './seasons-row';
import { SectionHeader } from './section-header';
import { TeamRow } from './team-row';

export interface HomeScreenProps {
  onOpenCycle?: (cycleId: string) => void;
  onOpenFields?: () => void;
  onAddSeason?: () => void;
  onAddIrrigationSource?: () => void;
  onOpenTeam?: () => void;
  onOpenCustomers?: () => void;
  onOpenSeasons?: () => void;
}

/**
 * Home (design handoff: FarmOS Home): glance-first daily overview. Built
 * against the sample fixtures in ../fixtures until the cycles/reminders API
 * exists — except the Team, Customers and Seasons counts, which are live.
 */
export function HomeScreen({
  onOpenCycle,
  onOpenFields,
  onAddSeason,
  onAddIrrigationSource,
  onOpenTeam,
  onOpenCustomers,
  onOpenSeasons,
}: HomeScreenProps) {
  const { t } = useTranslation();
  const workers = useWorkers();
  const customers = useCustomers();
  const seasons = useSeasons();
  const activeWorkerCount =
    workers.data?.filter((w) => w.isActive).length ?? teamSummary.workerCount;
  const activeCustomerCount = customers.data?.filter((c) => c.isActive).length;
  const openSeasonCount = seasons.data?.filter((s) => !s.isClosed).length;
  const signOut = useSignOut();

  const comingSoon = (title: string) =>
    Alert.alert(title, 'This is coming soon.');

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
        <SetupCard
          onAddSeason={() => onAddSeason?.()}
          onAddIrrigationSource={() => onAddIrrigationSource?.()}
        />
        <NetCashSummary
          month={homeSummary.month}
          netCash={homeSummary.netCash}
          moneyIn={homeSummary.moneyIn}
          moneyOut={homeSummary.moneyOut}
          onPressMoneyIn={() => comingSoon('Money in')}
          onPressMoneyOut={() => comingSoon('Money out')}
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
        <HomeLinksRow
          onSeeAllActivity={() => comingSoon('Activity')}
          onSeeAllFields={() => onOpenFields?.()}
        />
        <Divider />

        <SectionHeader label="Income vs expense · 6 mo" />
        <View className="items-center px-4 pb-1 pt-2">
          <IncomeExpenseChart data={incomeExpenseByMonth} />
        </View>
        <ChartLegend />
        <Divider />

        <TeamRow
          workerCount={activeWorkerCount}
          weeklyWages={teamSummary.weeklyWages}
          onPress={() => onOpenTeam?.()}
        />
        <Divider />
        <CustomersRow
          activeCount={activeCustomerCount}
          onPress={() => onOpenCustomers?.()}
        />
        <Divider />
        <SeasonsRow
          openCount={openSeasonCount}
          onPress={() => onOpenSeasons?.()}
        />
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
