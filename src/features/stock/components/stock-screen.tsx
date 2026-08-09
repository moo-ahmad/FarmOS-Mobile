import { ListFilter, TriangleAlert } from 'lucide-react-native';
import { Pressable, ScrollView } from 'react-native';

import { AppHeader, Banner, Screen } from '@/components/ui';
import { formatMoneyDisplay } from '@/lib/decimal';
import { colors } from '@/theme';

import { stockItems, stockValuation } from '../fixtures';
import { StockRow } from './stock-row';

/** Inventory (canvas `1a`, frame 9): valuation header, low-stock banner, level bars. */
export function StockScreen() {
  const lowCount = stockItems.filter((item) => item.status === 'low').length;

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`Valuation $${formatMoneyDisplay(stockValuation)}`}
        title="Inventory"
        right={
          <Pressable accessibilityRole="button" accessibilityLabel="Filter">
            <ListFilter size={22} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
        }
      />
      <ScrollView className="bg-neutral-0">
        {lowCount > 0 ? (
          <Banner icon={<TriangleAlert size={18} color={colors.white} />}>
            {lowCount} items below reorder level
          </Banner>
        ) : null}
        {stockItems.map((item, index) => (
          <StockRow
            key={item.id}
            item={item}
            showDivider={index < stockItems.length - 1}
          />
        ))}
      </ScrollView>
    </Screen>
  );
}
