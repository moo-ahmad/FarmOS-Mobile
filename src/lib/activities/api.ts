import { apiRequest, type AuthContext } from '@/lib/http/request';

/*
 * Activity wire types (`FarmOS.Application.Activities.*Dto`). Enum fields are
 * lookup values (`ActivityType` 1000–1011, `ActivityStatus` 2000–2003,
 * `PayBasis` 3000–3003). Decimals arrive as JSON numbers — display only,
 * never do arithmetic on them. Dates are `YYYY-MM-DD`; times `HH:mm:ss`.
 */

export interface ActivityInputLineDto {
  id: number;
  itemId: number | null;
  itemName: string;
  quantityValue: number;
  uomId: number;
  unitCost: number;
  totalCost: number;
  dilutionRatePerAcre: number | null;
}

export interface ActivityLaborLineDto {
  id: number;
  workerId: number;
  hours: number | null;
  payBasis: number;
  units: number | null;
  unitUomId: number | null;
  rate: number;
  amount: number;
}

export interface ActivityMachineLineDto {
  id: number;
  assetId: number | null;
  machineName: string;
  hours: number;
  startMeter: number | null;
  endMeter: number | null;
  fuelQuantity: number | null;
  fuelCost: number | null;
  hourlyChargeRate: number;
  amount: number;
  operatorWorkerId: number | null;
}

export interface ActivityDto {
  activityId: number;
  publicId: string;
  activityType: number;
  activityDate: string;
  startTime: string | null;
  endTime: string | null;
  fieldId: number | null;
  cropCycleId: number | null;
  treeId: number | null;
  isFarmLevel: boolean;
  title: string;
  description: string | null;
  status: number;
  supervisedByWorkerId: number | null;
  weatherNote: string | null;
  totalInputCost: number;
  totalLaborCost: number;
  totalMachineCost: number;
  totalCost: number;
  clientCreatedAtUtc: string;
  isVoid: boolean;
  voidReason: string | null;
  inputs: ActivityInputLineDto[];
  laborLines: ActivityLaborLineDto[];
  machineLines: ActivityMachineLineDto[];
}

/** Decimals as strings (the API accepts `number | string`) — never JS numbers. */
type DecimalString = string;

export interface ActivityInputLineBody {
  itemId: number | null;
  itemName: string;
  quantityValue: DecimalString;
  uomId: number;
  unitCost: DecimalString;
  dilutionRatePerAcre: DecimalString | null;
}

export interface ActivityLaborLineBody {
  workerId: number;
  hours: DecimalString | null;
  payBasis: number;
  units: DecimalString | null;
  unitUomId: number | null;
  rate: DecimalString;
}

export interface ActivityMachineLineBody {
  assetId: number | null;
  machineName: string;
  hours: DecimalString;
  hourlyChargeRate: DecimalString;
  startMeter: DecimalString | null;
  endMeter: DecimalString | null;
  fuelQuantity: DecimalString | null;
  fuelCost: DecimalString | null;
  operatorWorkerId: number | null;
}

/** PUT /api/activities/{id} body — header plus the full line set (lines are replaced). */
export interface UpdateActivityRequestBody {
  activityType: number;
  activityDate: string;
  title: string;
  isFarmLevel: boolean;
  fieldId: number | null;
  cropCycleId: number | null;
  treeId: number | null;
  status: number;
  description: string | null;
  supervisedByWorkerId: number | null;
  weatherNote: string | null;
  startTime: string | null;
  endTime: string | null;
  inputs: ActivityInputLineBody[];
  laborLines: ActivityLaborLineBody[];
  machineLines: ActivityMachineLineBody[];
}

/** POST /api/activities body. */
export interface CreateActivityRequestBody extends UpdateActivityRequestBody {
  /** ISO-8601 UTC instant the farmer saved it on the device. */
  clientCreatedAtUtc: string;
}

export interface ActivityFilter {
  cropCycleId?: number;
  fieldId?: number;
}

/** GET /api/activities — non-void activities, newest first. */
export function fetchActivities(
  filter: ActivityFilter,
  auth: AuthContext,
): Promise<ActivityDto[]> {
  const params = new URLSearchParams();
  if (filter.cropCycleId !== undefined) {
    params.set('cropCycleId', String(filter.cropCycleId));
  }
  if (filter.fieldId !== undefined) {
    params.set('fieldId', String(filter.fieldId));
  }
  const query = params.toString();
  return apiRequest(`/api/activities${query ? `?${query}` : ''}`, auth);
}

/** GET /api/activities/{id} — also returns a voided activity. */
export function fetchActivityById(
  activityId: number,
  auth: AuthContext,
): Promise<ActivityDto> {
  return apiRequest(`/api/activities/${activityId}`, auth);
}

/** POST /api/activities — header and every line in one request. */
export function createActivity(
  body: CreateActivityRequestBody,
  auth: AuthContext,
): Promise<ActivityDto> {
  return apiRequest('/api/activities', auth, { method: 'POST', body });
}

/** PUT /api/activities/{id} — 422 for a voided activity. */
export function updateActivity(
  activityId: number,
  body: UpdateActivityRequestBody,
  auth: AuthContext,
): Promise<ActivityDto> {
  return apiRequest(`/api/activities/${activityId}`, auth, {
    method: 'PUT',
    body,
  });
}

/**
 * POST /api/activities/{id}/void — activities are never deleted: voiding
 * keeps the record (and its reason) but drops its costs from every P&L.
 */
export function voidActivity(
  activityId: number,
  reason: string,
  auth: AuthContext,
): Promise<ActivityDto> {
  return apiRequest(`/api/activities/${activityId}/void`, auth, {
    method: 'POST',
    body: { reason },
  });
}
