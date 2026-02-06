import { useMemo } from "react";
import { RepeatWrapping, Texture, NoColorSpace } from "three";
import {
  instanceIndex,
  mix,
  uniform,
  ivec2,
  texture,
  uv,
  smoothstep,
  time,
  pow,
  hash,
  vec2,
  vec3,
  cross,
} from "three/tsl";
import { Fn } from "three/src/nodes/TSL.js";
import { Node } from "three/webgpu";
import {
  particlesMorphingConfig as config,
  type ParticlesMorphUniforms,
} from "../config";
import { type MeshAsset } from "./use-morph-meshes";
import { generateMorphTextures } from "../utils/morph-textures";
import { useTexture } from "@react-three/drei";

export function useMorphMaterial(resolution: number, meshes: MeshAsset[]) {
  const noiseTex = useTexture("/textures/noise.png", (tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.colorSpace = NoColorSpace;
  });

  const dataTextures = useMemo(
    () => generateMorphTextures(meshes, resolution),
    [meshes, resolution],
  );

  const material = useMemo(() => {
    const index = instanceIndex.toVar();

    /*
     * Uniforms
     */
    const uniforms: ParticlesMorphUniforms = {
      meshAIndex: uniform(config.meshAIndex),
      meshBIndex: uniform(config.meshBIndex),
      mapA: texture(meshes[config.meshAIndex].texture),
      mapB: texture(meshes[config.meshBIndex].texture),
      animationProgress: uniform(config.animationProgress),
      animationSynchronization: uniform(config.animationSynchronization),
      animationChaosAmplitude: uniform(config.animationChaosAmplitude),
      animationChaosFrequency: uniform(config.animationChaosFrequency),
      oscillationAmplitude: uniform(config.oscillationAmplitude),
      oscillationSpeed: uniform(config.oscillationSpeed),
      particleSize: uniform(config.particleSize),
      particleGlowSpread: uniform(config.particleGlowSpread),
      particleAlphaCutoff: uniform(config.particleAlphaCutoff),
      particleSharpness: uniform(config.particleSharpness),
    };

    /*
     * Positions
     */
    // Helper to read data from a specific layer (mesh index) of the DataArrayTexture
    const readLayer = Fn(
      ({
        layer,
        tex,
        instanceId,
      }: {
        layer: Node;
        tex: Texture;
        instanceId: Node;
      }) => {
        const x = instanceId.mod(resolution).toInt();
        const y = instanceId.div(resolution).toInt();

        return texture(tex, ivec2(x, y)).setSampler(false).depth(layer);
      },
    );

    // Morphing
    const shapeA = readLayer({
      layer: uniforms.meshAIndex,
      tex: dataTextures.positions,
      instanceId: index,
    });
    const shapeB = readLayer({
      layer: uniforms.meshBIndex,
      tex: dataTextures.positions,
      instanceId: index,
    });

    const posA = shapeA.rgb;
    const posB = shapeB.rgb;

    // Animation Randomization
    const uvsA = readLayer({
      layer: uniforms.meshAIndex,
      tex: dataTextures.uvs,
      instanceId: index,
    });
    const uvsB = readLayer({
      layer: uniforms.meshBIndex,
      tex: dataTextures.uvs,
      instanceId: index,
    });

    const noiseA = texture(noiseTex, uvsA.xy.mul(1.5)).r;
    const noiseB = texture(noiseTex, uvsB.xy.mul(1.5)).r;

    const finalNoise = mix(noiseA, noiseB, uniforms.animationProgress);
    const delay = uniforms.animationSynchronization.oneMinus().mul(finalNoise);
    const animationEnd = delay.add(uniforms.animationSynchronization);
    const progress = smoothstep(
      delay,
      animationEnd,
      uniforms.animationProgress,
    );

    /*
     * Creates a bell curve that peaks at 1.0 when progress is 0.5
     * Used to apply effects (like chaos/curl noise) only while the particles are traveling ↓
     */
    const midFlight = progress.mul(progress.oneMinus()).mul(4.0);

    const randomUV = vec2(hash(index), hash(index.add(100))).mul(10.0);

    // Oscillation
    const idleOscillation = texture(
      noiseTex,
      randomUV.add(time.mul(uniforms.oscillationSpeed).mul(0.1)),
    )
      .rgb.remap(0, 1, -1, 1)
      .mul(uniforms.oscillationAmplitude);

    // Morph Chaos
    const chaosUV = randomUV.add(
      time.mul(uniforms.animationChaosFrequency).mul(0.1),
    );
    const chaosDirection = texture(noiseTex, chaosUV).rgb.remap(0, 1, -1, 1);
    const curl = cross(chaosDirection, vec3(0, 1, 0));
    const finalDirection = mix(chaosDirection, curl, 0.5);
    const chaosOffset = finalDirection
      .mul(midFlight)
      .mul(uniforms.animationChaosAmplitude);

    // Final Position
    const positionNode = mix(posA, posB, progress)
      .add(chaosOffset)
      .add(idleOscillation);

    /*
     * Size
     */
    const sizeA = shapeA.a;
    const sizeB = shapeB.a;
    const currentSize = mix(sizeA, sizeB, progress);
    const scaleNode = uniforms.particleSize.mul(currentSize);

    /*
     * Shape
     */
    const dist = uv().distance(0.5);
    const glow = uniforms.particleGlowSpread.div(dist);
    const sharpGlow = pow(glow, uniforms.particleSharpness);
    const opacityNode = sharpGlow
      .sub(uniforms.particleAlphaCutoff.mul(uniforms.particleSharpness))
      .clamp(0, 1);

    /*
     * Colors
     */
    const colorA = texture(uniforms.mapA, uvsA.xy);
    const colorB = texture(uniforms.mapB, uvsB.xy);
    const colorNode = mix(colorA, colorB, progress);

    return {
      nodes: {
        positionNode,
        scaleNode,
        opacityNode,
        colorNode,
      },
      uniforms,
    };
  }, [dataTextures, meshes, resolution, noiseTex]);

  return {
    material,
    dataTextures, // Exposed for debugging visualization
  };
}
