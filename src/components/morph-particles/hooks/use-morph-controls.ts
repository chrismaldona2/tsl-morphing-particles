/* eslint-disable react-hooks/immutability */
import { useControls, folder } from "leva";
import { useCallback, useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import {
  particlesMorphingConfig as config,
  particleStyles,
  type ParticlesMorphParams,
  type ParticlesMorphUniforms,
  type ParticleStyleName,
} from "../config";
import type { MeshAsset } from "./use-morph-meshes";
import { capitalize } from "@/utils/capitalize";
import {
  AdditiveBlending,
  MultiplyBlending,
  NoBlending,
  NormalBlending,
  SubtractiveBlending,
} from "three";

type MorphControlsValues = Omit<ParticlesMorphParams, "resolution"> & {
  particleStyle: ParticleStyleName;
};

export function useMorphControls(
  uniforms: ParticlesMorphUniforms,
  meshes: MeshAsset[],
) {
  const isAnimating = useRef(false);
  const durationRef = useRef(config.animationDuration);

  const meshesOptions = useMemo(() => {
    return meshes.reduce(
      (acc, mesh) => {
        const label = capitalize(mesh.name);
        acc[label] = mesh.id;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [meshes]);

  const [controls, set] = useControls(
    "🧬 Morphing",
    () => ({
      meshA: {
        label: "Start Mesh",
        options: meshesOptions,
        value: config.meshA,
        onChange: (id: number) => {
          uniforms.meshA.value = id;
          const mesh = meshes.find((l) => l.id === id);
          if (mesh) uniforms.mapA.value = mesh.texture;
        },
      },
      meshB: {
        label: "End Mesh",
        options: meshesOptions,
        value: config.meshB,
        onChange: (id: number) => {
          uniforms.meshB.value = id;
          const mesh = meshes.find((l) => l.id === id);
          if (mesh) uniforms.mapB.value = mesh.texture;
        },
      },

      "Morph Animation": folder({
        animationProgress: {
          label: "Progress",
          value: config.animationProgress,
          min: 0,
          max: 1,
          step: 0.001,
          onChange: (v: number) => {
            if (!isAnimating.current) uniforms.animationProgress.value = v;
          },
        },
        animationDuration: {
          label: "Duration",
          value: config.animationDuration,
          min: 0.1,
          max: 5,
          step: 0.1,
          onChange: (v: number) => {
            durationRef.current = v;
          },
        },
        animationSynchronization: {
          label: "Synchronization",
          value: config.animationSynchronization,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (v: number) => {
            uniforms.animationSynchronization.value = v;
          },
        },
        animationChaosAmplitude: {
          label: "Chaos Amplitude",
          value: config.animationChaosAmplitude,
          min: 0,
          max: 5,
          onChange: (v: number) => {
            uniforms.animationChaosAmplitude.value = v;
          },
        },
        animationChaosFrequency: {
          label: "Chaos Frequency",
          value: config.animationChaosFrequency,
          min: 0,
          max: 3,
          onChange: (v: number) => {
            uniforms.animationChaosFrequency.value = v;
          },
        },
      }),

      Appearance: folder({
        particleStyle: {
          label: "Style",
          options: {
            "Soft Glow": "glow",
            "Hard Dot": "hard",
            Smooth: "smooth",
          },
          value: "hard" satisfies ParticleStyleName,
        },
        particleSize: {
          label: "Size",
          value: config.particleSize,
          min: 0,
          max: 0.2,
          step: 0.001,
          onChange: (v: number) => (uniforms.particleSize.value = v),
        },
        blending: {
          label: "Blending",
          options: {
            "Additive Blending": AdditiveBlending,
            "Normal Blending": NormalBlending,
            "No Blending": NoBlending,
            "Subtractive Blending": SubtractiveBlending,
            "Multiply Blending": MultiplyBlending,
          },
          value: config.blending,
        },
        depthWrite: {
          label: "Depth Write",
          value: config.depthWrite,
        },
        wireframe: {
          label: "Wireframe",
          value: config.wireframe,
        },
      }),

      Oscillation: folder({
        oscillationAmplitude: {
          label: "Amplitude",
          value: config.oscillationAmplitude,
          min: 0,
          max: 0.5,
          step: 0.001,
          onChange: (v: number) => (uniforms.oscillationAmplitude.value = v),
        },
        oscillationSpeed: {
          label: "Speed",
          value: config.oscillationSpeed,
          min: 0,
          max: 2,
          step: 0.01,
          onChange: (v: number) => (uniforms.oscillationSpeed.value = v),
        },
      }),
    }),
    [meshesOptions, meshes, uniforms],
  ) as unknown as [
    MorphControlsValues,
    (values: Partial<MorphControlsValues>) => void,
  ];

  useEffect(() => {
    const s = particleStyles[controls.particleStyle];
    if (!s) return;
    set({ particleSize: s.particleSize });
    uniforms.shapeRadius.value = s.shapeRadius;
    uniforms.shapeTurnOff.value = s.shapeTurnOff;
    uniforms.shapeHardness.value = s.shapeHardness;
  }, [controls.particleStyle, set, uniforms]);

  const trigger = useCallback(async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const currentProgress = uniforms.animationProgress.value;
    const targetProgress = currentProgress < 0.5 ? 1 : 0;

    await new Promise<void>((resolve) => {
      gsap.to(uniforms.animationProgress, {
        value: targetProgress,
        duration: durationRef.current,
        ease: "none",
        onComplete: () => {
          isAnimating.current = false;
          resolve();
        },
      });
    });
  }, [uniforms]);

  return { trigger, controls };
}
