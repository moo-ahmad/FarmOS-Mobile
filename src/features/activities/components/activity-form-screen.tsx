import { useRef, useState } from 'react';
import { ScrollView } from 'react-native';

import {
  Button,
  CaptureFooter,
  CaptureHeader,
  Screen,
  Text,
} from '@/components/ui';
import type { ActivityDto } from '@/lib/activities';
import { nowUtc } from '@/lib/datetime';

import { activityApiErrorMessage } from '../errors';
import {
  emptyActivityForm,
  toActivityFormValues,
  toCreateActivityRequest,
  toUpdateActivityRequest,
  type ActivityPreset,
} from '../form-values';
import { useCreateActivity, useUpdateActivity } from '../hooks';
import { activityTypeLabel } from '../model';
import type { ActivityFormValues } from '../schema';
import { ActivityForm, type ActivityFormHandle } from './activity-form';

export interface ActivityFormScreenProps {
  /** Omit to log a new activity; pass one to edit it. */
  activity?: ActivityDto;
  /** Pre-picks for a new activity, e.g. from a crop cycle or a reminder. */
  preset?: ActivityPreset;
  onClose: () => void;
  onSaved: (activity: ActivityDto) => void;
}

/**
 * Log activity / Edit activity — a capture modal (opened from the quick
 * capture button, a crop cycle, or a reminder). Saves straight to the API:
 * logging needs a connection until the offline sync endpoint exists.
 */
export function ActivityFormScreen({
  activity,
  preset,
  onClose,
  onSaved,
}: ActivityFormScreenProps) {
  const formRef = useRef<ActivityFormHandle>(null);
  const create = useCreateActivity();
  const update = useUpdateActivity(activity?.activityId ?? -1);
  const mutation = activity ? update : create;

  // Read once: the form takes its starting values on mount.
  const [initialValues] = useState(() =>
    activity ? toActivityFormValues(activity) : emptyActivityForm(preset),
  );

  const handleSubmit = (values: ActivityFormValues) => {
    if (activity) {
      update.mutate(toUpdateActivityRequest(values, activity), {
        onSuccess: onSaved,
      });
    } else {
      create.mutate(toCreateActivityRequest(values, nowUtc()), {
        onSuccess: onSaved,
      });
    }
  };

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={
          activity ? activityTypeLabel(activity.activityType) : 'New entry'
        }
        title={activity ? 'Edit activity' : 'Log activity'}
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0" keyboardShouldPersistTaps="handled">
        <ActivityForm
          ref={formRef}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
        {mutation.isError ? (
          <Text variant="caption" tone="accent" className="px-4 pb-4">
            {activityApiErrorMessage(mutation.error)}
          </Text>
        ) : null}
      </ScrollView>
      <CaptureFooter>
        <Button
          title={activity ? 'Save changes' : 'Log activity'}
          haptic="success"
          loading={mutation.isPending}
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
