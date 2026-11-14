import { describe, expect, it } from '@jest/globals';

import { ApiError } from '@/lib/http/errors';
import type { WorkerDto } from '@/lib/workers';

import { deleteWorkerErrorMessage } from './errors';
import {
  emptyWorkerForm,
  toWorkerFormValues,
  toWorkerRequest,
} from './form-values';
import { EmploymentType, isNotionallyWaged } from './model';
import { workerFormSchema } from './schema';
import { payLabel } from './worker-display';

const worker: WorkerDto = {
  workerId: 9,
  publicId: 'p',
  name: 'Rizwan',
  employmentType: EmploymentType.DailyWage,
  cnicOrId: null,
  phone: null,
  dailyWage: 1200,
  hourlyRate: null,
  overtimeMultiplier: 1.5,
  monthlySalary: null,
  skills: 'Tractor',
  joinDate: '2026-03-01',
  exitDate: null,
  isActive: true,
};

describe('worker form values', () => {
  it('starts a new worker on today as a daily-wage hand with 1.5× overtime', () => {
    expect(emptyWorkerForm('2026-11-14')).toMatchObject({
      employmentType: EmploymentType.DailyWage,
      joinDate: '2026-11-14',
      overtimeMultiplier: '1.5',
    });
  });

  it('round-trips a worker into a request with rates as strings', () => {
    expect(toWorkerRequest(toWorkerFormValues(worker))).toEqual({
      name: 'Rizwan',
      employmentType: 31002,
      joinDate: '2026-03-01',
      dailyWage: '1200',
      hourlyRate: null,
      overtimeMultiplier: '1.5',
      monthlySalary: null,
      cnicOrId: null,
      phone: null,
      skills: 'Tractor',
    });
  });
});

describe('workerFormSchema', () => {
  const valid = { ...emptyWorkerForm('2026-11-14'), name: 'Rizwan' };

  it('accepts a worker with no rates at all (piece-rate / contract)', () => {
    expect(workerFormSchema.safeParse(valid).success).toBe(true);
  });

  it.each([
    ['a zero daily wage', { dailyWage: '0' }],
    ['a negative monthly salary', { monthlySalary: '-100' }],
    ['a zero overtime multiplier', { overtimeMultiplier: '0' }],
    ['an impossible join date', { joinDate: '2026-02-30' }],
    ['a join date in the wrong format', { joinDate: '14/11/2026' }],
    ['a CNIC over 20 characters', { cnicOrId: '1'.repeat(21) }],
  ])('rejects %s', (_label, patch) => {
    expect(workerFormSchema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });
});

describe('worker display and rules', () => {
  it('summarises pay by the first rate that is set', () => {
    expect(payLabel(worker)).toBe('Rs 1,200/day');
    expect(payLabel({ ...worker, dailyWage: null, monthlySalary: 30000 })).toBe(
      'Rs 30,000/month',
    );
    expect(payLabel({ ...worker, dailyWage: null })).toBe('No rate set');
  });

  it('nudges owner and family labor toward a notional wage', () => {
    expect(isNotionallyWaged(EmploymentType.Self)).toBe(true);
    expect(isNotionallyWaged(EmploymentType.Family)).toBe(true);
    expect(isNotionallyWaged(EmploymentType.Permanent)).toBe(false);
  });

  it('explains a 422 delete without relying on the API detail', () => {
    expect(
      deleteWorkerErrorMessage(new ApiError(422, '/api/workers/9', {})),
    ).toMatch(/mark them as left|Deactivate them instead/);
  });
});
