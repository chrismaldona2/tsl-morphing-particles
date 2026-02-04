import type { ThreeElements } from "@react-three/fiber";
import { particlesMorphingConfig as config } from "./config";
import { useMorphControls } from "./hooks/use-morph-controls";
import { useMorphMaterial } from "./hooks/use-morph-material";
import { useControls } from "leva";
import Button3D from "@/components/button-3d/button-3d";
import MorphAssetsCredits from "./morph-assets-credits";
import { useMorphMeshes } from "./hooks/use-morph-meshes";

export default function MorphScene(props: ThreeElements["group"]) {
  /*
   * Resolution control moved outside of useMorphControls on purpose
   * Changing resolution requires resizing buffers and recompiling the shader
   * It needs to be defined before the material is created
   * Putting it here avoids circular dependency (Controls -> Resolution -> Material -> Uniforms -> Controls).
   */
  const { resolution } = useControls("🧬 Morphing", {
    resolution: {
      label: "Resolution",
      value: config.resolution,
      options: [32, 64, 128, 256, 512],
    },
  });

  const meshes = useMorphMeshes();
  const { nodes, uniforms } = useMorphMaterial(resolution, meshes);
  const { trigger, controls } = useMorphControls(uniforms, meshes);

  return (
    <group {...props}>
      {/* Actual Particles */}
      <instancedMesh
        /*
         * Force a full remount of the mesh when resolution changes
         * This ensures buffers are rebuilt correctly
         */
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
          {...nodes}
        />
      </instancedMesh>

      {/* Scene Extras */}
      <Button3D onClick={trigger} scale={0.4} position={[0, 0, 4]} />
      <MorphAssetsCredits uniforms={uniforms} meshes={meshes} />
    </group>
  );
}
