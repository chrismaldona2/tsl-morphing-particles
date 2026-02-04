/*
 * Disabled hooks immutability lintern on purpose as TSL Uniforms values are safe to modify
 */
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
import { AdditiveBlending, NormalBlending } from "three";

type MorphControlsValues = Omit<ParticlesMorphParams, "resolution"> & {
  particleStyle: ParticleStyleName;
};

export function useMorphControls(
  uniforms: ParticlesMorphUniforms,
  meshes: MeshAsset[],
) {
  const isAnimating = useRef(false); // To prevent the Leva slider from fighting GSAP
  const durationRef = useRef(config.animationDuration);
  const targetRef = useRef(config.animationProgress > 0.5 ? 1 : 0);

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
      meshAIndex: {
        label: "Start Mesh",
        options: meshesOptions,
        value: config.meshAIndex,
        onChange: (id: number) => {
          uniforms.meshAIndex.value = id;
          const mesh = meshes.find((l) => l.id === id);
          if (mesh) uniforms.mapA.value = mesh.texture;
        },
      },
      meshBIndex: {
        label: "End Mesh",
        options: meshesOptions,
        value: config.meshBIndex,
        onChange: (id: number) => {
          uniforms.meshBIndex.value = id;
          const mesh = meshes.find((l) => l.id === id);
          if (mesh) uniforms.mapB.value = mesh.texture;
        },
      },

      Animation: folder({
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
          max: 1.5,
          step: 0.01,
          onChange: (v: number) => {
            uniforms.animationChaosAmplitude.value = v;
          },
        },
        animationChaosFrequency: {
          label: "Chaos Frequency",
          value: config.animationChaosFrequency,
          min: 0,
          max: 0.5,
          step: 0.01,
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
          onChange: (v: number) => {
            uniforms.particleSize.value = v;
          },
        },
        particleGlowSpread: {
          label: "Glow Spread",
          value: config.particleGlowSpread,
          min: 0,
          max: 0.5,
          step: 0.01,
          onChange: (v: number) => {
            uniforms.particleGlowSpread.value = v;
          },
        },
        particleSharpness: {
          label: "Sharpness",
          value: config.particleSharpness,
          min: 0,
          max: 5,
          step: 0.1,
          onChange: (v: number) => {
            uniforms.particleSharpness.value = v;
          },
        },
        particleAlphaCutoff: {
          label: "Alpha Cutoff",
          value: config.particleAlphaCutoff,
          min: 0,
          max: 0.5,
          step: 0.01,
          onChange: (v: number) => {
            uniforms.particleAlphaCutoff.value = v;
          },
        },
        blending: {
          label: "Blending",
          options: {
            "Additive Blending": AdditiveBlending,
            "Normal Blending": NormalBlending,
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
          max: 0.1,
          step: 0.001,
          onChange: (v: number) => {
            uniforms.oscillationAmplitude.value = v;
          },
        },
        oscillationSpeed: {
          label: "Speed",
          value: config.oscillationSpeed,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (v: number) => {
            uniforms.oscillationSpeed.value = v;
          },
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
    set({
      particleSize: s.particleSize,
      particleGlowSpread: s.particleGlowSpread,
      particleAlphaCutoff: s.particleAlphaCutoff,
      particleSharpness: s.particleSharpness,
    });

    uniforms.particleSize.value = s.particleSize;
    uniforms.particleGlowSpread.value = s.particleGlowSpread;
    uniforms.particleAlphaCutoff.value = s.particleAlphaCutoff;
    uniforms.particleSharpness.value = s.particleSharpness;
  }, [controls.particleStyle, set, uniforms]);

  const trigger = useCallback(() => {
    const nextTarget = targetRef.current === 0 ? 1 : 0;
    targetRef.current = nextTarget;

    const currentProgress = uniforms.animationProgress.value;
    const distance = Math.abs(nextTarget - currentProgress);
    const time = durationRef.current * distance;

    gsap.killTweensOf(uniforms.animationProgress);
    isAnimating.current = true;

    gsap.to(uniforms.animationProgress, {
      value: nextTarget,
      duration: time,
      ease: "none",
      onComplete: () => {
        isAnimating.current = false;
      },
    });
  }, [uniforms]);

  return { trigger, controls };
}
