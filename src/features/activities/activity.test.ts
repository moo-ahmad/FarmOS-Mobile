import { describe, expect, it } from '@jest/globals';

import type { ActivityDto } from '@/lib/activities';
import { moneyToString } from '@/lib/decimal';
import type { WorkerDto } from '@/lib/workers';

import {
  activityCost,
  inputLineCost,
  laborLineCost,
  machineLineCost,
} from './costs';
import {
  emptyActivityForm,
  emptyInputLine,
  emptyMachineLine,
  laborLineFor,
  repriceLaborLine,
  toActivityFormValues,
  toCreateActivityRequest,
  toUpdateActivityRequest,
} from './form-values';
import {
  ActivityStatus,
  ActivityType,
  PayBasis,
  activityTypeForOperation,
} from './model';
import { activityFormSchema, type ActivityFormValues } from './schema';

const worker: WorkerDto = {
  workerId: 4,
  publicId: 'w',
  name: 'Rizwan',
  employmentType: 31002,
  cnicOrId: null,
  phone: null,
  dailyWage: 1200,
  hourlyRate: 150,
  overtimeMultiplier: 1.5,
  monthlySalary: null,
  skills: null,
  joinDate: '2026-01-01',
  exitDate: null,
  isActive: true,
};

const activity: ActivityDto = {
  activityId: 21,
  publicId: 'a',
  activityType: ActivityType.Spray,
  activityDate: '2026-11-10',
  startTime: '07:00:00',
  endTime: null,
  fieldId: 3,
  cropCycleId: 7,
  treeId: null,
  isFarmLevel: false,
  title: 'Aphid spray',
  description: null,
  status: ActivityStatus.Done,
  supervisedByWorkerId: 4,
  weatherNote: 'Calm',
  totalInputCost: 2400,
  totalLaborCost: 1200,
  totalMachineCost: 0,
  totalCost: 3600,
  clientCreatedAtUtc: '2026-11-10T03:00:00Z',
  isVoid: false,
  voidReason: null,
  inputs: [
    {
      id: 1,
      itemId: 9,
      itemName: 'Confidor',
      quantityValue: 0.2,
      uomId: 5,
      unitCost: 12000,
      totalCost: 2400,
      dilutionRatePerAcre: 0.1,
    },
  ],
  laborLines: [
    {
      id: 2,
      workerId: 4,
      hours: null,
      payBasis: PayBasis.Daily,
      units: null,
      unitUomId: null,
      rate: 1200,
      amount: 1200,
    },
  ],
  machineLines: [],
};

const valid = (
  patch: Partial<ActivityFormValues> = {},
): ActivityFormValues => ({
  ...emptyActivityForm({ cropCycleId: 7, fieldId: 3 }, '2026-11-14'),
  ...patch,
});

describe('activity form values', () => {
  it('starts on today, done, on the preset crop cycle', () => {
    expect(emptyActivityForm({ cropCycleId: 7 }, '2026-11-14')).toMatchObject({
      activityDate: '2026-11-14',
      status: ActivityStatus.Done,
      target: 'cycle',
      cropCycleId: 7,
    });
    expect(emptyActivityForm({ fieldId: 3 }).target).toBe('field');
  });

  it('maps reminder operations onto activity types', () => {
    expect(activityTypeForOperation('spray')).toBe(ActivityType.Spray);
    expect(activityTypeForOperation('Irrigation')).toBe(
      ActivityType.Irrigation,
    );
    expect(activityTypeForOperation('dance')).toBeUndefined();
  });

  it('prices a labor line from the worker: daily wage first, else hourly', () => {
    expect(laborLineFor(worker)).toMatchObject({
      workerId: 4,
      payBasis: PayBasis.Daily,
      rate: '1200',
    });
    expect(laborLineFor({ ...worker, dailyWage: null })).toMatchObject({
      payBasis: PayBasis.Hourly,
      rate: '150',
    });
  });

  it('re-prices from the saved rate when the pay basis or worker changes', () => {
    const daily = laborLineFor(worker);
    expect(
      repriceLaborLine(daily, worker, worker, PayBasis.Hourly),
    ).toMatchObject({ payBasis: PayBasis.Hourly, rate: '150' });
    expect(
      repriceLaborLine(daily, worker, worker, PayBasis.Contract).rate,
    ).toBe('');
    const other = { ...worker, workerId: 5, dailyWage: 1000 };
    expect(repriceLaborLine(daily, worker, other)).toMatchObject({
      workerId: 5,
      rate: '1000',
    });
    // A worker paid only by the hour moves a daily line to hourly.
    expect(
      repriceLaborLine(laborLineFor(), undefined, {
        ...worker,
        dailyWage: null,
      }),
    ).toMatchObject({ payBasis: PayBasis.Hourly, rate: '150' });
  });

  it('keeps a rate the farmer typed themselves', () => {
    const typed = { ...laborLineFor(worker), rate: '1400' };
    expect(
      repriceLaborLine(typed, worker, worker, PayBasis.Hourly),
    ).toMatchObject({ payBasis: PayBasis.Hourly, rate: '1400' });
    expect(
      repriceLaborLine(typed, worker, { ...worker, workerId: 5 }),
    ).toMatchObject({ workerId: 5, rate: '1400' });
  });

  it('creates with the title falling back to the type and the cycle’s field', () => {
    const body = toCreateActivityRequest(valid(), '2026-11-14T05:00:00Z');
    expect(body).toMatchObject({
      activityType: ActivityType.Irrigation,
      title: 'Irrigation',
      cropCycleId: 7,
      fieldId: 3,
      isFarmLevel: false,
      clientCreatedAtUtc: '2026-11-14T05:00:00Z',
      inputs: [],
    });
  });

  it('sends a whole-farm activity with no field or cycle', () => {
    const body = toCreateActivityRequest(valid({ target: 'farm' }), 'now');
    expect(body).toMatchObject({
      isFarmLevel: true,
      cropCycleId: null,
      fieldId: null,
    });
  });

  it('round-trips an activity, carrying what the form does not edit', () => {
    const body = toUpdateActivityRequest(
      toActivityFormValues(activity),
      activity,
    );
    expect(body).toMatchObject({
      title: 'Aphid spray',
      supervisedByWorkerId: 4,
      weatherNote: 'Calm',
      startTime: '07:00:00',
      inputs: [
        {
          itemId: 9,
          itemName: 'Confidor',
          quantityValue: '0.2',
          uomId: 5,
          unitCost: '12000',
          dilutionRatePerAcre: '0.1',
        },
      ],
      laborLines: [
        {
          workerId: 4,
          payBasis: PayBasis.Daily,
          hours: null,
          units: null,
          rate: '1200',
        },
      ],
    });
  });
});

describe('activityFormSchema', () => {
  it('accepts an activity with no lines', () => {
    expect(activityFormSchema.safeParse(valid()).success).toBe(true);
  });

  it.each([
    ['a cycle activity with no cycle', { cropCycleId: null }],
    [
      'a field activity with no field',
      { target: 'field' as const, fieldId: null },
    ],
    ['an impossible date', { activityDate: '2026-02-30' }],
    [
      'an input with no unit',
      {
        inputs: [
          {
            ...emptyInputLine(),
            itemName: 'Urea',
            quantityValue: '1',
            unitCost: '10',
          },
        ],
      },
    ],
    [
      'an hourly labor line with no hours',
      {
        laborLines: [
          { ...laborLineFor(worker), payBasis: PayBasis.Hourly, rate: '150' },
        ],
      },
    ],
    [
      'a machine line with zero hours',
      {
        machineLines: [
          {
            ...emptyMachineLine(),
            machineName: 'Tractor',
            hours: '0',
            hourlyChargeRate: '2500',
          },
        ],
      },
    ],
  ])('rejects %s', (_label, patch) => {
    expect(activityFormSchema.safeParse(valid(patch)).success).toBe(false);
  });
});

describe('activity cost previews', () => {
  const cost = (value: ReturnType<typeof inputLineCost>) =>
    value === null ? null : moneyToString(value);

  it('costs each kind of line the way the server does', () => {
    expect(
      cost(
        inputLineCost({
          ...emptyInputLine(),
          quantityValue: '2.5',
          unitCost: '4500',
        }),
      ),
    ).toBe('11250.00');
    expect(
      cost(
        laborLineCost({
          ...laborLineFor(worker),
          payBasis: PayBasis.Hourly,
          hours: '6',
          rate: '150',
        }),
      ),
    ).toBe('900.00');
    expect(cost(laborLineCost(laborLineFor(worker)))).toBe('1200.00');
    expect(
      cost(
        machineLineCost({
          ...emptyMachineLine(),
          hours: '1.5',
          hourlyChargeRate: '2500',
          fuelCost: '900',
        }),
      ),
    ).toBe('3750.00');
  });

  it('previews nothing for a half-typed line and skips it in the total', () => {
    expect(
      inputLineCost({ ...emptyInputLine(), quantityValue: '1.', unitCost: '' }),
    ).toBeNull();
    const total = activityCost(
      valid({
        inputs: [{ ...emptyInputLine(), quantityValue: 'x', unitCost: '10' }],
        laborLines: [laborLineFor(worker)],
      }),
    );
    expect(moneyToString(total)).toBe('1200.00');
  });
});
