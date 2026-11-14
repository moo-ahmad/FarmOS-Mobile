import { useMemo, useRef } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';
import type { WorkerDto } from '@/lib/workers';

import { workerApiErrorMessage } from '../errors';
import {
  emptyWorkerForm,
  toWorkerFormValues,
  toWorkerRequest,
} from '../form-values';
import { useCreateWorker, useUpdateWorker } from '../hooks';
import type { WorkerFormValues } from '../schema';
import { WorkerForm, type WorkerFormHandle } from './worker-form';

export interface WorkerFormScreenProps {
  /** Omit to add a new worker; pass one to edit them. */
  worker?: WorkerDto;
  onClose: () => void;
  onSaved: (worker: WorkerDto) => void;
}

/** Add Worker / Edit Worker — a capture-style modal like Add Field. */
export function WorkerFormScreen({
  worker,
  onClose,
  onSaved,
}: WorkerFormScreenProps) {
  const formRef = useRef<WorkerFormHandle>(null);
  const create = useCreateWorker();
  const update = useUpdateWorker(worker?.workerId ?? -1);
  const mutation = worker ? update : create;

  const initialValues = useMemo(
    () => (worker ? toWorkerFormValues(worker) : emptyWorkerForm()),
    [worker],
  );

  const handleSubmit = (values: WorkerFormValues) => {
    mutation.mutate(toWorkerRequest(values), { onSuccess: onSaved });
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={worker ? worker.name : 'New entry'}
        title={worker ? 'Edit worker' : 'Add worker'}
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <WorkerForm
          ref={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
        {mutation.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-2">
            {workerApiErrorMessage(mutation.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title={worker ? 'Save changes' : 'Save worker'}
          haptic="success"
          loading={mutation.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
