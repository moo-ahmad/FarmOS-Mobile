import { useRef } from 'react';
import { ScrollView } from 'react-native';

import { Button, CaptureFooter, CaptureHeader, Screen } from '@/components/ui';
import type { CropCycle } from '@/features/home';

import { HarvestForm, type HarvestFormHandle } from './harvest-form';

export interface HarvestScreenProps {
  onClose: () => void;
  onSaved: () => void;
  /** The cycle being harvested — defaults to the first active cycle. */
  cycle: CropCycle;
}

/**
 * Log Harvest (canvas `1a`, frame 7): a capture modal. UI-first — Save
 * validates and returns to the screen it was opened from; persistence isn't
 * wired yet (see the ui-conventions plan).
 */
export function HarvestScreen({ onClose, onSaved, cycle }: HarvestScreenProps) {
  const formRef = useRef<HarvestFormHandle>(null);

  return (
    <Screen edgeToEdgeBottom={false}>
      <CaptureHeader
        kicker={`${cycle.fieldCode} · ${cycle.title}`}
        title="Log harvest"
        onClose={onClose}
      />
      <ScrollView className="bg-neutral-0">
        <HarvestForm
          ref={formRef}
          fieldCode={cycle.fieldCode}
          cropLabel={cycle.title}
          onSubmit={() => onSaved()}
        />
      </ScrollView>
      <CaptureFooter>
        <Button
          title="Save harvest"
          haptic="success"
          onPress={() => formRef.current?.submit()}
        />
      </CaptureFooter>
    </Screen>
  );
}
