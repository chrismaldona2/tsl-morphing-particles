import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import {
  DataTexture,
  Material,
  Mesh,
  RGBAFormat,
  Texture,
  UnsignedByteType,
} from "three";
import type { ModelsGLB } from "../config";

/* Fallback Texture */
const white = new Uint8Array([255, 255, 255, 255]);
const defaultTex = new DataTexture(white, 1, 1);
defaultTex.format = RGBAFormat;
defaultTex.type = UnsignedByteType;
defaultTex.needsUpdate = true;

type TexturedMaterial = Material & {
  map?: Texture | null;
};

export type MeshAsset = {
  id: number;
  name: string;
  mesh: Mesh;
  texture: Texture;
};

export function useMorphMeshes() {
  const glb = useGLTF("/models/models.glb", "/draco/") as unknown as ModelsGLB;

  const meshes = useMemo<MeshAsset[]>(() => {
    return Object.entries(glb.nodes)
      .filter(([, obj]) => obj instanceof Mesh)
      .map(([name, mesh], index) => {
        const mat = mesh.material as TexturedMaterial;
        const texture = mat.map || defaultTex;

        return {
          name,
          mesh: mesh as Mesh,
          id: index,
          texture,
        };
      });
  }, [glb]);

  return meshes;
}
