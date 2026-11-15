import type {
  ActivityDto,
  CreateActivityRequestBody,
  UpdateActivityRequestBody,
} from '@/lib/activities';
import { emptyToNull, todayLocalDate } from '@/lib/forms/rules';
import type { WorkerDto } from '@/lib/workers';

import {
  ActivityStatus,
  ActivityType,
  PayBasis,
  activityTypeLabel,
  payBasisNeeds,
  type ActivityTarget,
} from './model';
import type {
  ActivityFormValues,
  InputLineValues,
  LaborLineValues,
  MachineLineValues,
} from './schema';

export interface ActivityPreset {
  activityType?: number;
  cropCycleId?: number;
  /** The cycle's field (so field-level lists include it) or a field on its own. */
  fieldId?: number;
}

/** A new activity's starting values: done today, on a crop cycle unless a field is given alone. */
export function emptyActivityForm(
  preset: ActivityPreset = {},
  today = todayLocalDate(),
): ActivityFormValues {
  const target: ActivityTarget =
    preset.cropCycleId === undefined && preset.fieldId !== undefined
      ? 'field'
      : 'cycle';
  return {
    activityType: preset.activityType ?? ActivityType.Irrigation,
    activityDate: today,
    status: ActivityStatus.Done,
    target,
    cropCycleId: preset.cropCycleId ?? null,
    fieldId: preset.fieldId ?? null,
    title: '',
    description: '',
    inputs: [],
    laborLines: [],
    machineLines: [],
  };
}

export const emptyInputLine = (): InputLineValues => ({
  itemId: null,
  dilutionRatePerAcre: null,
  itemName: '',
  quantityValue: '',
  uomId: null,
  unitCost: '',
});

/** A labor line for a worker, priced from their own rate: daily wage first, else hourly. */
export function laborLineFor(worker?: WorkerDto): LaborLineValues {
  const hourlyOnly = worker?.dailyWage === null && worker.hourlyRate !== null;
  const rate = hourlyOnly ? worker.hourlyRate : (worker?.dailyWage ?? null);
  return {
    unitUomId: null,
    workerId: worker?.workerId ?? null,
    payBasis: hourlyOnly ? PayBasis.Hourly : PayBasis.Daily,
    hours: '',
    units: '',
    rate: rate === null ? '' : String(rate),
  };
}

/** The worker's saved rate for a pay basis: daily wage or hourly rate. Piece rate and contract have none. */
export function savedRateFor(
  worker: WorkerDto | undefined,
  payBasis: number,
): string | null {
  if (!worker) return null;
  const rate =
    payBasis === PayBasis.Daily
      ? worker.dailyWage
      : payBasis === PayBasis.Hourly
        ? worker.hourlyRate
        : null;
  return rate === null ? null : String(rate);
}

/**
 * The labor line after its worker or pay basis changes. The rate follows the
 * worker's saved rate for that basis, unless the farmer typed their own
 * (a rate that isn't the previous worker's saved one), which is kept.
 */
export function repriceLaborLine(
  line: LaborLineValues,
  before: WorkerDto | undefined,
  after: WorkerDto | undefined,
  payBasis: number = line.payBasis,
): LaborLineValues {
  const rate = line.rate.trim();
  const typedOwn = rate !== '' && rate !== savedRateFor(before, line.payBasis);
  if (typedOwn) {
    return { ...line, workerId: after?.workerId ?? null, payBasis };
  }
  // A new worker with no rate for a daily/hourly line gets the basis they're paid on.
  const switchBasis =
    after !== before &&
    savedRateFor(after, payBasis) === null &&
    (payBasis === PayBasis.Daily || payBasis === PayBasis.Hourly);
  const basis = switchBasis ? laborLineFor(after).payBasis : payBasis;
  return {
    ...line,
    workerId: after?.workerId ?? null,
    payBasis: basis,
    rate: savedRateFor(after, basis) ?? '',
  };
}

export const emptyMachineLine = (): MachineLineValues => ({
  assetId: null,
  startMeter: null,
  endMeter: null,
  machineName: '',
  hours: '',
  hourlyChargeRate: '',
  fuelQuantity: '',
  fuelCost: '',
  operatorWorkerId: null,
});

const str = (value: number | null) => (value === null ? '' : String(value));
const strOrNull = (value: number | null) =>
  value === null ? null : String(value);

function targetOf(activity: ActivityDto): ActivityTarget {
  if (activity.cropCycleId !== null) return 'cycle';
  if (activity.fieldId !== null) return 'field';
  return 'farm';
}

/** An activity as the form's starting values (every decimal as the string the user edits). */
export function toActivityFormValues(
  activity: ActivityDto,
): ActivityFormValues {
  return {
    activityType: activity.activityType,
    activityDate: activity.activityDate,
    status: activity.status,
    target: targetOf(activity),
    cropCycleId: activity.cropCycleId,
    fieldId: activity.fieldId,
    title: activity.title,
    description: activity.description ?? '',
    inputs: activity.inputs.map((line) => ({
      itemId: line.itemId,
      dilutionRatePerAcre: strOrNull(line.dilutionRatePerAcre),
      itemName: line.itemName,
      quantityValue: String(line.quantityValue),
      uomId: line.uomId,
      unitCost: String(line.unitCost),
    })),
    laborLines: activity.laborLines.map((line) => ({
      unitUomId: line.unitUomId,
      workerId: line.workerId,
      payBasis: line.payBasis,
      hours: str(line.hours),
      units: str(line.units),
      rate: String(line.rate),
    })),
    machineLines: activity.machineLines.map((line) => ({
      assetId: line.assetId,
      startMeter: strOrNull(line.startMeter),
      endMeter: strOrNull(line.endMeter),
      machineName: line.machineName,
      hours: String(line.hours),
      hourlyChargeRate: String(line.hourlyChargeRate),
      fuelQuantity: str(line.fuelQuantity),
      fuelCost: str(line.fuelCost),
      operatorWorkerId: line.operatorWorkerId,
    })),
  };
}

/** Header fields this form doesn't edit, carried over from the activity on update. */
type CarriedFields = Pick<
  UpdateActivityRequestBody,
  'treeId' | 'supervisedByWorkerId' | 'weatherNote' | 'startTime' | 'endTime'
>;

const NOTHING_CARRIED: CarriedFields = {
  treeId: null,
  supervisedByWorkerId: null,
  weatherNote: null,
  startTime: null,
  endTime: null,
};

function toBody(
  values: ActivityFormValues,
  carried: CarriedFields,
): UpdateActivityRequestBody {
  const onCycle = values.target === 'cycle';
  const onField = values.target === 'field';
  return {
    activityType: values.activityType,
    activityDate: values.activityDate.trim(),
    // The title is optional in the form; the API needs one, so the type stands in.
    title: values.title.trim() || activityTypeLabel(values.activityType),
    isFarmLevel: values.target === 'farm',
    cropCycleId: onCycle ? values.cropCycleId : null,
    // A cycle's activity also records its field, so field-level views include it.
    fieldId: onCycle || onField ? values.fieldId : null,
    status: values.status,
    description: emptyToNull(values.description),
    ...carried,
    inputs: values.inputs.map((line) => ({
      itemId: line.itemId,
      itemName: line.itemName.trim(),
      quantityValue: line.quantityValue.trim(),
      uomId: line.uomId as number,
      unitCost: line.unitCost.trim(),
      dilutionRatePerAcre: line.dilutionRatePerAcre,
    })),
    laborLines: values.laborLines.map((line) => {
      const needs = payBasisNeeds(line.payBasis);
      return {
        workerId: line.workerId as number,
        payBasis: line.payBasis,
        hours: needs === 'units' ? null : emptyToNull(line.hours),
        units: needs === 'units' ? emptyToNull(line.units) : null,
        unitUomId: needs === 'units' ? line.unitUomId : null,
        rate: line.rate.trim(),
      };
    }),
    machineLines: values.machineLines.map((line) => ({
      assetId: line.assetId,
      machineName: line.machineName.trim(),
      hours: line.hours.trim(),
      hourlyChargeRate: line.hourlyChargeRate.trim(),
      startMeter: line.startMeter,
      endMeter: line.endMeter,
      fuelQuantity: emptyToNull(line.fuelQuantity),
      fuelCost: emptyToNull(line.fuelCost),
      operatorWorkerId: line.operatorWorkerId,
    })),
  };
}

/** Validated values as the POST body, stamped with when the farmer saved it. */
export function toCreateActivityRequest(
  values: ActivityFormValues,
  clientCreatedAtUtc: string,
): CreateActivityRequestBody {
  return { ...toBody(values, NOTHING_CARRIED), clientCreatedAtUtc };
}

/**
 * Validated values as the PUT body. PUT replaces the header and every line,
 * so the header fields this form doesn't show are carried over unchanged.
 */
export function toUpdateActivityRequest(
  values: ActivityFormValues,
  activity: ActivityDto,
): UpdateActivityRequestBody {
  return toBody(values, {
    treeId: activity.treeId,
    supervisedByWorkerId: activity.supervisedByWorkerId,
    weatherNote: activity.weatherNote,
    startTime: activity.startTime,
    endTime: activity.endTime,
  });
}
