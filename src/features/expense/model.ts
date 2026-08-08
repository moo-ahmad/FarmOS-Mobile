/** Log Expense domain vocabulary (canvas `1a` frame 8). */

export const EXPENSE_CATEGORIES = [
  'inputs',
  'labour',
  'fuel',
  'machinery',
  'fixed',
] as const;
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  inputs: 'Inputs',
  labour: 'Labour',
  fuel: 'Fuel',
  machinery: 'Machinery',
  fixed: 'Fixed',
};

export const PAID_BY_OPTIONS = ['cash', 'bank'] as const;
export type PaidBy = (typeof PAID_BY_OPTIONS)[number];

export const PAID_BY_LABEL: Record<PaidBy, string> = {
  cash: 'Cash',
  bank: 'Bank',
};
