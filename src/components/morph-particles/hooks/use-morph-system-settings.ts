import { useControls } from "leva";
import {
  particlesMorphingConfig as config,
  morphingDebugFolderName,
} from "../config";

export function useMorphSystemSettings() {
  const { resolution, debug } = useControls(morphingDebugFolderName, {
    resolution: {
      label: "Resolution",
      value: config.resolution,
      options: [32, 64, 128, 256, 512],
    },
    debug: {
      label: "Debug",
      value: false,
    },
  });

  return { resolution, debug };
}
