import type { ThreeElements } from "@react-three/fiber";
import { useMorphControls } from "./hooks/use-morph-controls";
import { useMorphMaterial } from "./hooks/use-morph-material";
import Button3D from "@/components/button-3d/button-3d";
import MorphAssetsCredits from "./morph-assets-credits";
import { useMorphMeshes } from "./hooks/use-morph-meshes";
import { MorphTexturesDebug } from "./morph-textures-debug";
import { useMorphSystemSettings } from "./hooks/use-morph-system-settings";

export default function MorphShowcase(props: ThreeElements["group"]) {
  const meshes = useMorphMeshes();
  const { resolution, debug } = useMorphSystemSettings();
  const { material, dataTextures } = useMorphMaterial(resolution, meshes);
  const { trigger, controls, activeMesh } = useMorphControls(
    material.uniforms,
    meshes,
  );

  return (
    <group {...props}>
      {/* Actual Particles */}
      <instancedMesh
        /*
         * Force a full remount of the mesh when resolution changes
         * This ensures buffers are rebuilt correctly
         */
        key={`particles-${resolution}`}
        args={[undefined, undefined, resolution * resolution]}
        frustumCulled={false}
      >
        <planeGeometry />
        <spriteNodeMaterial
          transparent={controls.transparent}
          blending={controls.blending}
          depthWrite={controls.depthWrite}
          wireframe={controls.wireframe}
          alphaToCoverage={controls.alphaToCoverage}
          {...material.nodes}
        />
      </instancedMesh>

      {/* Debug Tools */}
      {debug && (
        <MorphTexturesDebug
          key={`debug-${resolution}`}
          positions={dataTextures.positions}
          uvs={dataTextures.uvs}
          activeMesh={activeMesh}
        />
      )}

      {/* Scene Extras */}
      <Button3D onClick={trigger} scale={0.4} position={[0, 0, 4]} />
      <MorphAssetsCredits activeMesh={activeMesh} />
    </group>
  );
}
