import { router } from 'expo-router';

import { CaptureChooser } from '@/features/capture';

// The center FAB's landing screen. router.replace (not push) so this chooser
// doesn't sit in the back stack — dismissing the chosen capture modal returns
// straight to the screen the FAB was pressed from.
export default function CaptureChooserRoute() {
  return (
    <CaptureChooser
      onClose={() => router.back()}
      onSelect={(kind) => router.replace(`/capture/${kind}`)}
    />
  );
}
