import { useControls, folder } from "leva";
import { buttonConfig as config, type ButtonUniforms } from "./config";

export function useButton3DControls(uniforms: ButtonUniforms) {
  return useControls(
    "🔴 Button",
    () => ({
      "Button Appearance": folder({
        buttonColor: {
          label: "Color",
          value: config.buttonColor,
          onChange: (v: string) => uniforms.buttonColor.value.set(v),
        },
        buttonRoughness: {
          label: "Roughness",
          value: config.buttonRoughness,
          min: 0,
          max: 1,
          onChange: (v: number) => {
            uniforms.buttonRoughness.value = v;
          },
        },
        buttonMetalness: {
          label: "Metalness",
          value: config.buttonMetalness,
          min: 0,
          max: 1,
          onChange: (v: number) => {
            uniforms.buttonMetalness.value = v;
          },
        },
      }),

      "Base Appearance": folder({
        baseColor: {
          label: "Color",
          value: config.baseColor,
          onChange: (v: string) => uniforms.baseColor.value.set(v),
        },
        baseRoughness: {
          label: "Roughness",
          value: config.baseRoughness,
          min: 0,
          max: 1,
          onChange: (v: number) => {
            uniforms.baseRoughness.value = v;
          },
        },
        baseMetalness: {
          label: "Metalness",
          value: config.baseMetalness,
          min: 0,
          max: 1,
          onChange: (v: number) => {
            uniforms.baseMetalness.value = v;
          },
        },
      }),

      Animation: folder({
        pressDepth: {
          label: "Press Depth",
          value: config.pressDepth,
          min: 0.05,
          max: 0.5,
          onChange: (v: number) => {
            uniforms.downDistance.value.y = -v;
          },
        },
        pressDuration: {
          label: "Press Duration",
          value: config.pressDuration,
          min: 0.05,
          max: 1.0,
        },
        releaseDuration: {
          label: "Release Duration",
          value: config.releaseDuration,
          min: 0.1,
          max: 2.0,
        },
      }),
    }),
    { collapsed: true },
  );
}
