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
} from "three/tsl";
import { Fn } from "three/src/nodes/TSL.js";
import { Node } from "three/webgpu";
import {
  particlesMorphingConfig as config,
  type ParticlesMorphUniforms,
} from "../config";
import { useMorphMeshes } from "./use-morph-meshes";
import { bakeParticles } from "../utils/bake-particles";
import { useTexture } from "@react-three/drei";

export function useMorphShader(resolution: number) {
  const noiseTex = useTexture("/noise.png", (tex) => {
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.colorSpace = NoColorSpace;
  });

  const meshes = useMorphMeshes();

  const data = useMemo(
    () => bakeParticles(meshes, resolution),
    [meshes, resolution],
  );

  const material = useMemo(() => {
    const index = instanceIndex.toVar();

    /*
     * Uniforms
     */
    const uniforms: ParticlesMorphUniforms = {
      meshA: uniform(config.meshA),
      meshB: uniform(config.meshB),
      mapA: texture(meshes[config.meshA].texture),
      mapB: texture(meshes[config.meshB].texture),
      animationProgress: uniform(config.animationProgress),
      animationSynchronization: uniform(config.animationSynchronization),
      animationChaosAmplitude: uniform(config.animationChaosAmplitude),
      animationChaosFrequency: uniform(config.animationChaosFrequency),
      oscillationAmplitude: uniform(config.oscillationAmplitude),
      oscillationSpeed: uniform(config.oscillationSpeed),
      particleSize: uniform(config.particleSize),
      shapeRadius: uniform(config.shapeRadius),
      shapeTurnOff: uniform(config.shapeTurnOff),
      shapeHardness: uniform(config.shapeHardness),
    };

    /*
     * Positions
     */
    // Helper to read the different layer of the DataArrayTexture's
    const readLayer = Fn(({ layer, tex }: { layer: Node; tex: Texture }) => {
      const x = index.mod(resolution).toInt();
      const y = index.div(resolution).toInt();

      return texture(tex, ivec2(x, y)).setSampler(false).depth(layer);
    });

    // Morphing
    const shapeA = readLayer({
      layer: uniforms.meshA,
      tex: data.positions,
    });
    const shapeB = readLayer({
      layer: uniforms.meshB,
      tex: data.positions,
    });

    const posA = shapeA.rgb;
    const posB = shapeB.rgb;

    // Animation Randomization
    const uvsA = readLayer({ layer: uniforms.meshA, tex: data.uvs });
    const uvsB = readLayer({ layer: uniforms.meshB, tex: data.uvs });

    const noiseA = texture(noiseTex, uvsA.xy.mul(1.5)).r; // No remap (keep 0..1)
    const noiseB = texture(noiseTex, uvsB.xy.mul(1.5)).r; // No remap (keep 0..1)

    const finalNoise = mix(noiseA, noiseB, uniforms.animationProgress);
    const delay = uniforms.animationSynchronization.oneMinus().mul(finalNoise);
    const animationEnd = delay.add(uniforms.animationSynchronization);
    const progress = smoothstep(
      delay,
      animationEnd,
      uniforms.animationProgress,
    );

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
    const midFlight = progress.mul(progress.oneMinus()).mul(4.0); // Bell Curve
    const chaosOffset = chaosDirection
      .mul(midFlight)
      .mul(uniforms.animationChaosAmplitude);

    // Final Position
    const positionNode = mix(posA, posB, progress)
      .add(chaosOffset)
      .add(idleOscillation);

    /*
     * Size
     */
    const sizeA = posA.a;
    const sizeB = posB.a;
    const currentSize = mix(sizeA, sizeB, progress);
    const scaleNode = uniforms.particleSize.mul(currentSize);

    /*
     * Shape
     */
    const dist = uv().distance(0.5);
    const opacityNode = pow(
      uniforms.shapeRadius.div(dist),
      uniforms.shapeHardness,
    )
      .sub(uniforms.shapeTurnOff)
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
  }, [data, meshes, resolution, noiseTex]);

  return { material, meshes };
}
