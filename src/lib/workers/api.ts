import { apiRequest, type AuthContext } from '@/lib/http/request';

/**
 * A worker as returned by the API (`FarmOS.Application.Workers.WorkerDto`).
 * `employmentType` is the `EmploymentType` lookup value (Permanent = 31000, …).
 * Rates arrive as JSON numbers — display only, never do arithmetic on them.
 */
export interface WorkerDto {
  workerId: number;
  publicId: string;
  name: string;
  employmentType: number;
  cnicOrId: string | null;
  phone: string | null;
  dailyWage: number | null;
  hourlyRate: number | null;
  overtimeMultiplier: number;
  monthlySalary: number | null;
  skills: string | null;
  /** Calendar date, `YYYY-MM-DD`. */
  joinDate: string;
  /** Calendar date, `YYYY-MM-DD`; set when the worker is deactivated. */
  exitDate: string | null;
  isActive: boolean;
}

export interface WorkerRequestBody {
  name: string;
  employmentType: number;
  /** `YYYY-MM-DD`. */
  joinDate: string;
  /** Decimals as strings (the API accepts `number | string`) — never JS numbers. */
  dailyWage: string | null;
  hourlyRate: string | null;
  overtimeMultiplier: string;
  monthlySalary: string | null;
  cnicOrId: string | null;
  phone: string | null;
  skills: string | null;
}

/** GET /api/workers — every worker on the farm (active and deactivated), by name. */
export function fetchWorkers(auth: AuthContext): Promise<WorkerDto[]> {
  return apiRequest('/api/workers', auth);
}

/** GET /api/workers/{id}. */
export function fetchWorkerById(
  workerId: number,
  auth: AuthContext,
): Promise<WorkerDto> {
  return apiRequest(`/api/workers/${workerId}`, auth);
}

/** POST /api/workers — 201 Created with the new worker. */
export function createWorker(
  body: WorkerRequestBody,
  auth: AuthContext,
): Promise<WorkerDto> {
  return apiRequest('/api/workers', auth, { method: 'POST', body });
}

/** PUT /api/workers/{id}. */
export function updateWorker(
  workerId: number,
  body: WorkerRequestBody,
  auth: AuthContext,
): Promise<WorkerDto> {
  return apiRequest(`/api/workers/${workerId}`, auth, { method: 'PUT', body });
}

/**
 * POST /api/workers/{id}/deactivate — records the farm-local `exitDate`
 * (`YYYY-MM-DD`); payroll history keeps referencing the worker.
 */
export function deactivateWorker(
  workerId: number,
  exitDate: string,
  auth: AuthContext,
): Promise<WorkerDto> {
  return apiRequest(`/api/workers/${workerId}/deactivate`, auth, {
    method: 'POST',
    body: { exitDate },
  });
}

/** POST /api/workers/{id}/reactivate — clears `exitDate`. */
export function reactivateWorker(
  workerId: number,
  auth: AuthContext,
): Promise<WorkerDto> {
  return apiRequest(`/api/workers/${workerId}/reactivate`, auth, {
    method: 'POST',
  });
}

/** DELETE /api/workers/{id} — 204; a 422 once attendance, labor or wages reference the worker. */
export function deleteWorker(
  workerId: number,
  auth: AuthContext,
): Promise<void> {
  return apiRequest(`/api/workers/${workerId}`, auth, { method: 'DELETE' });
}
