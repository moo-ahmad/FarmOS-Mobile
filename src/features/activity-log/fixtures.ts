/**
 * Ambient conditions captured at spray time — informational, not user-edited
 * (would come from a weather API/device sensors + a PPE checklist in a real
 * build). Stands in for that until such a source exists.
 */
export const currentConditions = {
  tempC: 28,
  windKph: 8,
  ppeConfirmed: true,
} as const;
