import type { ThreeElements } from "@react-three/fiber";
import { particlesMorphingConfig as config } from "./config";
import { useMorphControls } from "./hooks/use-morph-controls";
import { useMorphShader } from "./hooks/use-morph-shader";
import { useControls } from "leva";
import Button from "../button";
import MorphAssetsCredits from "./morph-assets-credits";

export default function MorphParticles(props: ThreeElements["group"]) {
  const { resolution } = useControls("🧬 Morphing", {
    resolution: {
      label: "Resolution",
      value: config.resolution,
      options: [32, 64, 128, 256, 512],
    },
  });

  const { material, meshes } = useMorphShader(resolution);
  const { trigger, controls } = useMorphControls(material.uniforms, meshes);

  return (
    <group {...props}>
      <instancedMesh
        key={resolution}
        args={[undefined, undefined, resolution * resolution]}
        frustumCulled={false}
      >
        <planeGeometry />
        <spriteNodeMaterial
          depthWrite={controls.depthWrite}
          blending={controls.blending}
          wireframe={controls.wireframe}
          transparent
          {...material.nodes}
        />
      </instancedMesh>

      <Button onClick={trigger} scale={0.4} position={[0, 0, 4]} />

      <MorphAssetsCredits uniforms={material.uniforms} meshes={meshes} />
    </group>
  );
}
