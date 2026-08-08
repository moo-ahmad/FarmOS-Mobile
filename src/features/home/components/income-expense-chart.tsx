import { Fragment } from 'react';
import { Line, Rect, Svg, Text as SvgText } from 'react-native-svg';

import { colors } from '@/theme';

export interface MonthPoint {
  /** Short month label, e.g. "Nov". */
  label: string;
  income: number;
  expense: number;
}

export interface IncomeExpenseChartProps {
  data: readonly MonthPoint[];
  width?: number;
  height?: number;
}

const BAR_GAP = 3; // gap between the income/expense pair within a month
const GROUP_PADDING = 6; // horizontal padding either side of a month group
const AXIS_HEIGHT = 14; // space reserved for month labels below the baseline

/**
 * 312×96 SVG paired bar chart: ink bars = income, red bars = expense, a 1.5px
 * ink baseline, muted 9px month labels below. Drawn from data, not an image.
 */
export function IncomeExpenseChart({
  data,
  width = 312,
  height = 96,
}: IncomeExpenseChartProps) {
  const plotHeight = height - AXIS_HEIGHT;
  const max = Math.max(1, ...data.map((d) => Math.max(d.income, d.expense)));
  const groupWidth = width / data.length;
  const barWidth = (groupWidth - GROUP_PADDING * 2 - BAR_GAP) / 2;

  return (
    <Svg width={width} height={height}>
      {data.map((point, index) => {
        const groupX = index * groupWidth + GROUP_PADDING;
        const incomeHeight = (point.income / max) * (plotHeight - 4);
        const expenseHeight = (point.expense / max) * (plotHeight - 4);
        return (
          <Fragment key={point.label}>
            <Rect
              x={groupX}
              y={plotHeight - incomeHeight}
              width={barWidth}
              height={incomeHeight}
              fill={colors.ink}
            />
            <Rect
              x={groupX + barWidth + BAR_GAP}
              y={plotHeight - expenseHeight}
              width={barWidth}
              height={expenseHeight}
              fill={colors.accent.DEFAULT}
            />
            <SvgText
              x={groupX + barWidth + BAR_GAP / 2}
              y={height - 2}
              fontSize={9}
              fontFamily="Archivo_400Regular"
              fill={colors.neutral[500]}
              textAnchor="middle"
            >
              {point.label}
            </SvgText>
          </Fragment>
        );
      })}
      <Line
        x1={0}
        y1={plotHeight}
        x2={width}
        y2={plotHeight}
        stroke={colors.ink}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
