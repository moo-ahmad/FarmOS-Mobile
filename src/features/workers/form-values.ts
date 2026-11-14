import { emptyToNull, todayLocalDate } from '@/lib/forms/rules';
import type { WorkerDto, WorkerRequestBody } from '@/lib/workers';

import { EmploymentType } from './model';
import type { WorkerFormValues } from './schema';

/** A new worker's starting values: a daily-wage hand joining today. */
export function emptyWorkerForm(today = todayLocalDate()): WorkerFormValues {
  return {
    name: '',
    employmentType: EmploymentType.DailyWage,
    joinDate: today,
    dailyWage: '',
    hourlyRate: '',
    monthlySalary: '',
    overtimeMultiplier: '1.5',
    cnicOrId: '',
    phone: '',
    skills: '',
  };
}

const rateToString = (rate: number | null) =>
  rate === null ? '' : String(rate);

/** A worker as the form's starting values (rates as the strings the user edits). */
export function toWorkerFormValues(worker: WorkerDto): WorkerFormValues {
  return {
    name: worker.name,
    employmentType: worker.employmentType,
    joinDate: worker.joinDate,
    dailyWage: rateToString(worker.dailyWage),
    hourlyRate: rateToString(worker.hourlyRate),
    monthlySalary: rateToString(worker.monthlySalary),
    overtimeMultiplier: String(worker.overtimeMultiplier),
    cnicOrId: worker.cnicOrId ?? '',
    phone: worker.phone ?? '',
    skills: worker.skills ?? '',
  };
}

/** Validated form values as the POST/PUT body — rates stay strings. */
export function toWorkerRequest(values: WorkerFormValues): WorkerRequestBody {
  return {
    name: values.name.trim(),
    employmentType: values.employmentType,
    joinDate: values.joinDate.trim(),
    dailyWage: emptyToNull(values.dailyWage),
    hourlyRate: emptyToNull(values.hourlyRate),
    monthlySalary: emptyToNull(values.monthlySalary),
    overtimeMultiplier: values.overtimeMultiplier.trim(),
    cnicOrId: emptyToNull(values.cnicOrId),
    phone: emptyToNull(values.phone),
    skills: emptyToNull(values.skills),
  };
}
