import { useControls } from "leva";
import {
  particlesMorphingConfig as config,
  morphingDebugFolderName,
} from "../config";

/**
 * Separated to prevent circular dependencies (Material depends on Resolution) and isolate destructive state.
 * Unlike uniforms controls, changing 'resolution' alters buffer allocations and requires a hard remount.
 */
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
