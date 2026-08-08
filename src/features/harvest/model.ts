/** Log Harvest domain vocabulary (canvas `1a` frame 7). */

export const GRADES = ['A', 'B', 'C', 'Cull'] as const;
export type Grade = (typeof GRADES)[number];

export const WEIGHT_UNIT = 'kg';
export const WEIGHT_STEP = '10';
