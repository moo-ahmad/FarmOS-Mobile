/**
 * A numeric route param (`/customer/[id]`) as an id, or undefined for
 * anything that isn't a positive integer — so a bad link shows "not found"
 * instead of requesting `/api/customers/NaN`.
 */
export function parseRouteId(
  param: string | string[] | undefined,
): number | undefined {
  const raw = Array.isArray(param) ? param[0] : param;
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const id = Number.parseInt(raw, 10);
  return id > 0 ? id : undefined;
}
