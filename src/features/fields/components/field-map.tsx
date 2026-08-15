import { Circle, Rect, Svg, Text as SvgText } from 'react-native-svg';

import { colors } from '@/theme';

import type { Field } from '../fixtures';

export interface FieldMapProps {
  fields: readonly [Field, Field, Field, Field];
  /** Draws an accent outline over this parcel — the field the user arrived to see. */
  focusCode?: string;
}

const WIDTH = 344;
const HEIGHT = 176;
const MUTED_45 = 'rgba(32,30,29,0.45)';
const MUTED_55 = 'rgba(32,30,29,0.55)';

/** Parcel bounds, matched to the fixed layout below, keyed by field code. */
const PARCEL_BOUNDS: Record<
  string,
  { x: number; y: number; width: number; height: number }
> = {
  F1: { x: 18, y: 20, width: 150, height: 86 },
  F2: { x: 176, y: 20, width: 150, height: 40 },
  F3: { x: 176, y: 68, width: 150, height: 38 },
  F4: { x: 18, y: 116, width: 308, height: 44 },
};

/**
 * Schematic field-parcel diagram (344×176) — not a geographic map. Layout is
 * fixed to match the design exactly (design handoff: FarmOS Land, "Fields"
 * frame); labels are pulled from `fields` so the diagram stays in sync with
 * the list below it.
 */
export function FieldMap({
  fields: [f1, f2, f3, f4],
  focusCode,
}: FieldMapProps) {
  const focusBounds = focusCode ? PARCEL_BOUNDS[focusCode] : undefined;

  return (
    <Svg
      width={WIDTH}
      height={HEIGHT}
      style={{ backgroundColor: colors.surface }}
    >
      {/* F1 */}
      <Rect
        x={18}
        y={20}
        width={150}
        height={86}
        fill="none"
        stroke={colors.ink}
        strokeWidth={2}
      />
      <SvgText
        x={26}
        y={38}
        fontFamily="Archivo_800ExtraBold"
        fontSize={13}
        fill={colors.ink}
      >
        {f1.code}
      </SvgText>
      <SvgText x={26} y={98} fontSize={9} fill={MUTED_55}>
        {f1.title}
      </SvgText>

      {/* F2 — fallow: dashed muted border */}
      <Rect
        x={176}
        y={20}
        width={150}
        height={40}
        fill="none"
        stroke={colors.neutral[500]}
        strokeWidth={2}
        strokeDasharray="4 3"
      />
      <SvgText
        x={184}
        y={38}
        fontFamily="Archivo_800ExtraBold"
        fontSize={13}
        fill={colors.neutral[600]}
      >
        {f2.code}
      </SvgText>
      <SvgText x={184} y={52} fontSize={9} fill={MUTED_45}>
        {f2.title}
      </SvgText>

      {/* F3 — ready to harvest */}
      <Rect
        x={176}
        y={68}
        width={150}
        height={38}
        fill="none"
        stroke={colors.ink}
        strokeWidth={2}
      />
      <SvgText
        x={184}
        y={86}
        fontFamily="Archivo_800ExtraBold"
        fontSize={13}
        fill={colors.ink}
      >
        {f3.code}
      </SvgText>
      <SvgText x={248} y={86} fontSize={9} fill={colors.accent.DEFAULT}>
        {f3.tagLabel}
      </SvgText>

      {/* F4 — orchard: a row of dots stands in for tree rows */}
      <Rect
        x={18}
        y={116}
        width={308}
        height={44}
        fill="none"
        stroke={colors.ink}
        strokeWidth={2}
      />
      {[40, 60, 80, 100, 120].map((cx) => (
        <Circle key={cx} cx={cx} cy={138} r={4} fill={colors.ink} />
      ))}
      <SvgText
        x={150}
        y={142}
        fontFamily="Archivo_800ExtraBold"
        fontSize={13}
        fill={colors.ink}
      >
        {f4.code} · {f4.title}
      </SvgText>

      {focusBounds ? (
        <Rect
          x={focusBounds.x - 3}
          y={focusBounds.y - 3}
          width={focusBounds.width + 6}
          height={focusBounds.height + 6}
          fill="none"
          stroke={colors.accent.DEFAULT}
          strokeWidth={3}
        />
      ) : null}
    </Svg>
  );
}
