export interface Crop {
  id: string;
  /** e.g. "Wheat · Faisal-11" — crop, then variety. */
  title: string;
}

export interface OpenSeason {
  id: string;
  name: string;
  /** e.g. "Rabi". */
  kind: string;
  codeSuffix: string;
  /** Calendar date, `YYYY-MM-DD`. */
  startDate: string;
  /** Calendar date, `YYYY-MM-DD`. */
  endDate: string;
}

export interface CropCycleFormValues {
  fieldId: number;
  fieldCode: string;
  cropId: string;
  seasonId: string;
  cycleCode: string;
}
