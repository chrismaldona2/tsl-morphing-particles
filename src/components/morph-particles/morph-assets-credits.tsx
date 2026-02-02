import { useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  particlesMorphingConfig as config,
  credits,
  type MeshName,
  type ParticlesMorphUniforms,
} from "./config";
import { ui } from "@/utils/tunnels";
import type { MeshAsset } from "./hooks/use-morph-meshes";
import { CreditOverlay } from "../credit-overlay";

type MorphCreditsProps = {
  uniforms: ParticlesMorphUniforms;
  meshes: MeshAsset[];
};

export default function MorphAssetsCredits({
  uniforms,
  meshes,
}: MorphCreditsProps) {
  const [visibleId, setVisibleId] = useState(config.meshA);

  useFrame(() => {
    const progress = uniforms.animationProgress.value;
    const meshA = uniforms.meshA.value;
    const meshB = uniforms.meshB.value;

    const dominantId = progress < 0.5 ? meshA : meshB;

    if (dominantId !== visibleId) {
      setVisibleId(dominantId);
    }
  });

  const visibleMesh = meshes.find((l) => l.id === visibleId);
  const credit = visibleMesh ? credits[visibleMesh.name as MeshName] : null;

  if (!credit) return null;

  return (
    <ui.In>
      <CreditOverlay className="bottom-0 right-0">
        <a href={credit.model.url} target="_blank" className="underline">
          {credit.model.title}
        </a>{" "}
        by{" "}
        <a href={credit.author.profile} target="_blank" className="underline">
          {credit.author.name}
        </a>
      </CreditOverlay>
    </ui.In>
  );
}
