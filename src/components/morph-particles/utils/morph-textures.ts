import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";
import {
  DataArrayTexture,
  FloatType,
  NearestFilter,
  RGBAFormat,
  Vector2,
  Vector3,
} from "three";
import type { MeshAsset } from "../hooks/use-morph-meshes";

/*
 *
 * Bakes mesh surface data into DataArrayTextures for GPU access.
 *
 * All mesh data is pre-loaded into separate texture layers, enabling
 * instantaneous transitions with zero CPU overhead. The shader simply
 * reads from a different texture layer to morph the shape.
 *
 * Eliminates the need for expensive CPU-side geometry attribute swapping.
 *
 */
// TODO: Move to Web Worker for high resolutions
export function generateMorphTextures(meshes: MeshAsset[], resolution: number) {
  const particlesCount = resolution * resolution;
  const paramsPerPixel = 4;
  const totalSize = particlesCount * meshes.length * paramsPerPixel;

  const posData = new Float32Array(totalSize);
  const uvData = new Float32Array(totalSize);
  const _position = new Vector3();
  const _uv = new Vector2();

  meshes.forEach((mesh) => {
    const sampler = new MeshSurfaceSampler(mesh.mesh).build();

    for (let i = 0; i < particlesCount; i++) {
      sampler.sample(_position, undefined, undefined, _uv);

      const stride =
        mesh.id * particlesCount * paramsPerPixel + i * paramsPerPixel;

      // Position (XYZ) + Random Size (W)
      posData[stride] = _position.x;
      posData[stride + 1] = _position.y;
      posData[stride + 2] = _position.z;
      posData[stride + 3] = Math.random();

      // UVs
      uvData[stride] = _uv.x;
      uvData[stride + 1] = _uv.y;
      uvData[stride + 2] = 0;
      uvData[stride + 3] = 0;
    }
  });

  const createTex = (data: Float32Array) => {
    const t = new DataArrayTexture(data, resolution, resolution, meshes.length);
    t.format = RGBAFormat;
    t.type = FloatType;
    t.minFilter = NearestFilter;
    t.magFilter = NearestFilter;
    t.needsUpdate = true;
    return t;
  };

  return {
    positions: createTex(posData),
    uvs: createTex(uvData),
  };
}
