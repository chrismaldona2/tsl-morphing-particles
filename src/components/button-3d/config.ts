import { Vector3 } from "three";
import { type UniformNode } from "three/webgpu";
import type { UniformSet } from "../../types/uniforms";

export type ButtonMaterialParams = {
  buttonColor: string;
  buttonRoughness: number;
  buttonMetalness: number;
  baseColor: string;
  baseRoughness: number;
  baseMetalness: number;
};

export type ButtonAnimationParams = {
  pressDepth: number;
  pressDuration: number;
  releaseDuration: number;
};

export type ButtonConfigParams = ButtonMaterialParams & ButtonAnimationParams;

export const buttonConfig: ButtonConfigParams = {
  // Visuals
  buttonColor: "#d04141",
  buttonRoughness: 0.65,
  buttonMetalness: 0.0,
  baseColor: "#616060",
  baseRoughness: 0.3,
  baseMetalness: 0.3,

  // Press/Release Animation
  pressDepth: 0.3,
  pressDuration: 0.3,
  releaseDuration: 0.6,
};

// Excluded some params that are handled by JS (gsap), not the shader directly
type NoUniformParams = "pressDepth" | "pressDuration" | "releaseDuration";

export type ButtonUniforms = UniformSet<
  Omit<ButtonConfigParams, NoUniformParams>
> & {
  pressStrength: UniformNode<number>;
  downDistance: UniformNode<Vector3>;
};
