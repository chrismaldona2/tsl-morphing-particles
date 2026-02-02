import type { UniformNode } from "three/webgpu";
import type { Color, Vector2, Vector3, Vector4 } from "three";

type MappedValue<T> = T extends number
  ? number
  : T extends boolean
    ? boolean
    : T extends string | Color
      ? Color
      : T extends Vector2 | [number, number]
        ? Vector2
        : T extends Vector3 | [number, number, number]
          ? Vector3
          : T extends Vector4 | [number, number, number, number]
            ? Vector4
            : never;

type IsLeaf<T> = T extends
  | number
  | boolean
  | string
  | Color
  | Vector2
  | Vector3
  | Vector4
  | unknown[]
  ? true
  : false;

export type UniformSet<T> = {
  [K in keyof T]: IsLeaf<T[K]> extends true
    ? UniformNode<MappedValue<T[K]>>
    : T[K] extends object
      ? UniformSet<T[K]>
      : never;
};
