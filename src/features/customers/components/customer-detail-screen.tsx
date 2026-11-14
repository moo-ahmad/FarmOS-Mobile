import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  Eye,
  EyeOff,
  EllipsisVertical,
  Pencil,
  Trash2,
} from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { ActionsSheet } from '@/components/actions-sheet';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DetailList } from '@/components/detail-list';
import { AppHeader, Callout, Screen } from '@/components/ui';
import type { CustomerDto } from '@/lib/customers';
import { formatMoneyDisplay, parseMoney } from '@/lib/decimal';
import { colors } from '@/theme';

import { customerApiErrorMessage, deleteCustomerErrorMessage } from '../errors';
import { useDeleteCustomer, useSetCustomerActive } from '../hooks';
import { customerTypeLabel } from '../model';

export interface CustomerDetailScreenProps {
  customer: CustomerDto;
  onBack: () => void;
  onEdit: () => void;
  onDeleted: () => void;
}

/** Customer detail: terms and contact, with Edit / Deactivate / Delete in the ⋮ menu. */
export function CustomerDetailScreen({
  customer,
  onBack,
  onEdit,
  onDeleted,
}: CustomerDetailScreenProps) {
  const actionsRef = useRef<BottomSheetModal>(null);
  const [confirming, setConfirming] = useState<'deactivate' | 'delete' | null>(
    null,
  );
  const setActive = useSetCustomerActive(customer.customerId);
  const remove = useDeleteCustomer(customer.customerId);

  const closeConfirm = () => {
    setConfirming(null);
    setActive.reset();
    remove.reset();
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <AppHeader
        compact
        kicker={customerTypeLabel(customer.customerType)}
        title={customer.name}
        onBack={onBack}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Customer actions"
            hitSlop={12}
            onPress={() => actionsRef.current?.present()}
          >
            <EllipsisVertical size={20} color={colors.ink} />
          </Pressable>
        }
      />
      <ScrollView className="bg-neutral-0">
        {customer.isActive ? null : (
          <Callout className="mx-4 mt-4">
            This customer is deactivated — hidden from active lists.
          </Callout>
        )}
        <DetailList
          items={[
            { label: 'Phone', value: customer.phone },
            {
              label: 'Commission',
              value: `${String(customer.commissionPct)}%`,
            },
            {
              label: 'Credit terms',
              value:
                customer.creditTermDays === 0
                  ? 'Cash'
                  : `${customer.creditTermDays} days`,
            },
            {
              label: 'Credit limit',
              value:
                customer.creditLimit === null
                  ? 'No limit'
                  : `Rs ${formatMoneyDisplay(parseMoney(String(customer.creditLimit)))}`,
            },
            { label: 'Address', value: customer.address },
          ]}
        />
        {setActive.isError && confirming === null ? (
          <Callout className="m-4">
            {customerApiErrorMessage(setActive.error)}
          </Callout>
        ) : null}
      </ScrollView>

      <ActionsSheet
        ref={actionsRef}
        title={customer.name}
        actions={[
          {
            key: 'edit',
            icon: Pencil,
            label: 'Edit customer',
            sub: 'Name, type, phone, terms, address',
            onPress: onEdit,
          },
          customer.isActive
            ? {
                key: 'deactivate',
                icon: EyeOff,
                label: 'Deactivate customer',
                sub: 'Hide from active lists; sales history is kept',
                onPress: () => setConfirming('deactivate'),
              }
            : {
                key: 'reactivate',
                icon: Eye,
                label: 'Reactivate customer',
                sub: 'Show in active lists again',
                onPress: () => setActive.mutate(true),
              },
          {
            key: 'delete',
            icon: Trash2,
            label: 'Delete customer',
            sub: 'Only for a customer with no sales yet',
            destructive: true,
            onPress: () => setConfirming('delete'),
          },
        ]}
      />

      <ConfirmDialog
        visible={confirming === 'deactivate'}
        title="Deactivate this customer?"
        message={`${customer.name} will be hidden from active lists. Their sales history stays intact, and you can reactivate them later.`}
        confirmLabel="Deactivate"
        loading={setActive.isPending}
        errorMessage={
          setActive.isError
            ? customerApiErrorMessage(setActive.error)
            : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() =>
          setActive.mutate(false, { onSuccess: () => setConfirming(null) })
        }
      />

      <ConfirmDialog
        visible={confirming === 'delete'}
        title="Delete this customer?"
        message={`${customer.name} will be removed for good. This only works if no sales have been recorded for them — otherwise deactivate instead.`}
        confirmLabel="Delete"
        loading={remove.isPending}
        errorMessage={
          remove.isError ? deleteCustomerErrorMessage(remove.error) : undefined
        }
        onCancel={closeConfirm}
        onConfirm={() =>
          remove.mutate(undefined, {
            onSuccess: () => {
              setConfirming(null);
              onDeleted();
            },
          })
        }
      />
    </Screen>
  );
}
