import type { TagVariant } from '@/components/ui';
import { toMoney, type Money } from '@/lib/decimal';

import type { MonthPoint } from './components/income-expense-chart';

/**
 * Sample data for the Home screen (canvas `1a`, frame 1). Stands in for the
 * derived-P&L / cycles / reminders domain, which is not modeled yet — see
 * docs/release.md and the ui-conventions plan. Replace with real queries once
 * the API exposes farms/cycles/reminders.
 */

export interface HomeSummary {
  moneyIn: Money;
  moneyOut: Money;
  netCash: Money;
  month: string;
}

export const homeSummary: HomeSummary = {
  moneyIn: toMoney('12400'),
  moneyOut: toMoney('6140'),
  netCash: toMoney('48320'),
  month: 'April',
};

export interface CropCycle {
  id: string;
  fieldCode: string;
  title: string;
  sub: string;
  daysToHarvest: number;
  cost: Money;
  budget: Money;
}

export const cropCycles: CropCycle[] = [
  {
    id: 'cycle-f3-wheat',
    fieldCode: 'F3',
    title: 'Wheat · Faisal-11',
    sub: 'Field 3 · 2.1 ha · Grain fill',
    daysToHarvest: 14,
    cost: toMoney('4120'),
    budget: toMoney('5600'),
  },
  {
    id: 'cycle-f1-cotton',
    fieldCode: 'F1',
    title: 'Cotton · IUB-13',
    sub: 'Field 1 · 3.4 ha · Flowering',
    daysToHarvest: 61,
    cost: toMoney('6880'),
    budget: toMoney('9200'),
  },
  {
    id: 'cycle-f4-mango',
    fieldCode: 'F4',
    title: 'Mango · Sindhri',
    sub: 'Field 4 · 1.8 ha · Fruit set',
    daysToHarvest: 48,
    cost: toMoney('1150'),
    budget: toMoney('2400'),
  },
];

export const incomeExpenseByMonth: MonthPoint[] = [
  { label: 'Nov', income: 5200, expense: 3100 },
  { label: 'Dec', income: 6100, expense: 3600 },
  { label: 'Jan', income: 4800, expense: 4200 },
  { label: 'Feb', income: 7300, expense: 3900 },
  { label: 'Mar', income: 8900, expense: 5100 },
  { label: 'Apr', income: 12400, expense: 6140 },
];

export type AlertKind = 'phi' | 'irrigation' | 'reorder';

export interface AttentionAlert {
  id: string;
  kind: AlertKind;
  message: string;
  emphasis: string;
  tagLabel: string;
  tagVariant: TagVariant;
}

export const attentionAlerts: AttentionAlert[] = [
  {
    id: 'alert-phi',
    kind: 'phi',
    message: 'Spray PHI ends today — ',
    emphasis: 'F3 Wheat',
    tagLabel: 'Today',
    tagVariant: 'accent',
  },
  {
    id: 'alert-irrigation',
    kind: 'irrigation',
    message: 'Irrigation due — ',
    emphasis: 'F1 Cotton',
    tagLabel: 'Overdue',
    tagVariant: 'solid',
  },
  {
    id: 'alert-reorder',
    kind: 'reorder',
    message: 'Urea low — ',
    emphasis: '2 bags left',
    tagLabel: 'Reorder',
    tagVariant: 'neutral',
  },
];

export interface TeamSummary {
  workerCount: number;
  weeklyWages: Money;
}

/** "Team" row summary — independent of src/features/attendance's fixtures. */
export const teamSummary: TeamSummary = {
  workerCount: 8,
  weeklyWages: toMoney('310'),
};
