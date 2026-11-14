import { ChevronRight, Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

import {
  AppHeader,
  Callout,
  Divider,
  Screen,
  Tag,
  Text,
} from '@/components/ui';
import type { CustomerDto } from '@/lib/customers';
import { colors } from '@/theme';

import { useCustomers } from '../hooks';
import { customerTypeLabel } from '../model';

export interface CustomersScreenProps {
  onBack?: () => void;
  onAddCustomer: () => void;
  onOpenCustomer: (customerId: number) => void;
}

function CustomerRow({
  customer,
  onPress,
}: {
  customer: CustomerDto;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="min-h-tap flex-row items-center gap-3 px-4 py-3.5"
    >
      <View className="flex-1">
        <Text variant="row">{customer.name}</Text>
        <Text variant="caption" tone="muted">
          {customerTypeLabel(customer.customerType)}
          {customer.phone ? ` · ${customer.phone}` : ''}
        </Text>
      </View>
      {customer.isActive ? null : <Tag label="Inactive" variant="neutral" />}
      <ChevronRight size={18} color={colors.neutral[500]} strokeWidth={2} />
    </Pressable>
  );
}

/**
 * Customers: everyone the farm sells to, wired to `GET /api/customers`.
 * Active customers by default; deactivated ones sit behind a toggle so they
 * can still be opened and reactivated.
 */
export function CustomersScreen({
  onBack,
  onAddCustomer,
  onOpenCustomer,
}: CustomersScreenProps) {
  const { data, isPending, isError, refetch } = useCustomers();
  const [showInactive, setShowInactive] = useState(false);

  const all = useMemo(() => data ?? [], [data]);
  const activeCount = all.filter((c) => c.isActive).length;
  const inactiveCount = all.length - activeCount;
  const shown = showInactive ? all : all.filter((c) => c.isActive);

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        kicker={`${activeCount} active`}
        title="Customers"
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add customer"
            hitSlop={12}
            onPress={onAddCustomer}
          >
            <Plus size={24} color={colors.ink} strokeWidth={1.9} />
          </Pressable>
        }
      />
      <ScrollView
        className="bg-neutral-0"
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {isPending ? (
          <View className="items-center py-12">
            <ActivityIndicator color={colors.ink} />
          </View>
        ) : isError ? (
          <Callout className="m-4">
            Couldn&apos;t load customers.{' '}
            <Text
              tone="accent"
              className="font-archivo-bold"
              onPress={() => refetch()}
            >
              Retry
            </Text>
          </Callout>
        ) : shown.length === 0 ? (
          <View className="items-center gap-1 px-8 py-12">
            <Text variant="row">No customers yet</Text>
            <Text variant="caption" tone="muted" className="text-center">
              Add the arthis and traders you sell to, so sales can be recorded
              against them.
            </Text>
          </View>
        ) : (
          shown.map((customer, index) => (
            <View key={customer.customerId}>
              <CustomerRow
                customer={customer}
                onPress={() => onOpenCustomer(customer.customerId)}
              />
              {index < shown.length - 1 ? <Divider className="mx-4" /> : null}
            </View>
          ))
        )}

        {inactiveCount > 0 ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => setShowInactive((value) => !value)}
            className="min-h-tap justify-center px-4"
          >
            <Text tone="accent" className="font-archivo-bold text-label">
              {showInactive
                ? 'Hide inactive'
                : `Show inactive (${inactiveCount})`}
            </Text>
          </Pressable>
        ) : null}
      </ScrollView>
    </Screen>
  );
}
