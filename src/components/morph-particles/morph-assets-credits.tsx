import { credits, type MeshName } from "./config";
import { ui } from "@/utils/tunnels";
import type { MeshAsset } from "./hooks/use-morph-meshes";
import CreditOverlay from "@/components/ui/credit-overlay";

type MorphCreditsProps = {
  activeMesh?: MeshAsset;
};

export default function MorphAssetsCredits({ activeMesh }: MorphCreditsProps) {
  const credit = activeMesh ? credits[activeMesh.name as MeshName] : null;
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
