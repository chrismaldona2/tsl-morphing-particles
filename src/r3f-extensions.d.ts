import {
  MeshBasicNodeMaterial,
  PointsNodeMaterial,
  SpriteNodeMaterial,
  MeshStandardNodeMaterial,
} from "three/webgpu";
import type { MaterialNode } from "@react-three/fiber";

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshBasicNodeMaterial: MaterialNode<
      MeshBasicNodeMaterial,
      typeof MeshBasicNodeMaterial
    >;
    meshStandardNodeMaterial: MaterialNode<
      MeshStandardNodeMaterial,
      typeof MeshStandardNodeMaterial
    >;
    pointsNodeMaterial: MaterialNode<
      PointsNodeMaterial,
      typeof PointsNodeMaterial
    >;
    spriteNodeMaterial: MaterialNode<
      SpriteNodeMaterial,
      typeof SpriteNodeMaterial
    >;
  }
}
