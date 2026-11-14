import { formatMoneyDisplay, parseMoney } from '@/lib/decimal';
import type { WorkerDto } from '@/lib/workers';

/** "Rs 1,200" for a rate the API sent as a JSON number; null when unset. Display only. */
export function rateLabel(rate: number | null): string | null {
  return rate === null
    ? null
    : `Rs ${formatMoneyDisplay(parseMoney(String(rate)))}`;
}

/** The one-line pay summary for a list row: the first rate that's set. */
export function payLabel(worker: WorkerDto): string {
  if (worker.dailyWage !== null) return `${rateLabel(worker.dailyWage)}/day`;
  if (worker.monthlySalary !== null) {
    return `${rateLabel(worker.monthlySalary)}/month`;
  }
  if (worker.hourlyRate !== null) return `${rateLabel(worker.hourlyRate)}/hr`;
  return 'No rate set';
}
