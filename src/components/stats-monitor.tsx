import { Stats } from "@react-three/drei";
import { useControls } from "leva";

export default function StatsMonitor() {
  const { enabled } = useControls({
    enabled: {
      label: "Show Stats",
      value: false,
    },
  });

  return <>{enabled && <Stats />}</>;
}
