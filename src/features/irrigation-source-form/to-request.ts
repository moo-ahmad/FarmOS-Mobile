import type { CreateIrrigationSourceRequestBody } from '@/lib/irrigation-sources';

import { COST_KIND_WIRE, SOURCE_KIND_WIRE } from './model';
import type { IrrigationSourceFormValues } from './schema';

/** Form values → POST body. A "Free" source always sends a rate of 0. */
export function toCreateIrrigationSourceBody(
  values: IrrigationSourceFormValues,
): CreateIrrigationSourceRequestBody {
  return {
    name: values.name,
    sourceType: SOURCE_KIND_WIRE[values.sourceKind],
    costModel: COST_KIND_WIRE[values.costKind],
    ratePerUnit: values.costKind === 'Free' ? '0' : values.ratePerUnit,
    dischargeLpm: values.dischargeLpm || null,
    pumpAssetId: null,
  };
}
