import { HomeScreen } from '@/features/home';

// onOpenCycle wires to the Crop P&L screen once that route exists (canvas `1a`,
// frame 2) — cycle rows are inert for now rather than linking to a dead route.
export default function HomeRoute() {
  return <HomeScreen />;
}
