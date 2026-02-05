import { useMemo, useEffect } from "react";
import { type Texture } from "three";
import { texture, uniform, uv, abs } from "three/tsl";
import { Html } from "@react-three/drei";
import { type ThreeElements } from "@react-three/fiber";
import type { MeshAsset } from "./hooks/use-morph-meshes";

type MorphDebugProps = {
  positions: Texture;
  uvs: Texture;
  activeMesh?: MeshAsset;
};

export function MorphTexturesDebug({
  positions,
  uvs,
  activeMesh,
}: MorphDebugProps) {
  return (
    <group position={[3, 1, 0]}>
      <DebugPlane
        tex={positions}
        layer={activeMesh?.id}
        isPosition
        label="Positions"
      />
      <DebugPlane
        tex={uvs}
        layer={activeMesh?.id}
        position-x={1.6}
        label="UVs"
      />
      <DebugPlane
        tex={uvs}
        map={activeMesh?.texture}
        layer={activeMesh?.id}
        position-x={3.2}
        label="Colors"
      />
    </group>
  );
}

/* * Sub-component for individual debug planes
 */
type DebugPlaneProps = ThreeElements["group"] & {
  tex: Texture;
  map?: Texture;
  layer?: number;
  isPosition?: boolean;
  label?: string;
};
function DebugPlane({
  tex,
  map,
  layer = 0,
  isPosition = false,
  label,
  ...props
}: DebugPlaneProps) {
  const { nodes, uniforms } = useMemo(() => {
    const uniforms = {
      layer: uniform(layer),
      map: texture(map),
    };

    const rawData = texture(tex, uv()).depth(uniforms.layer);

    let colorNode;
    if (isPosition) {
      colorNode = abs(rawData);
    } else if (map) {
      colorNode = texture(uniforms.map, rawData.xy);
    } else {
      colorNode = rawData;
    }

    return { nodes: { colorNode }, uniforms };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    uniforms.layer.value = layer;
    if (map) uniforms.map.value = map;
  }, [uniforms, layer, map]);

  return (
    <group {...props}>
      <mesh scale={1.5}>
        <planeGeometry />
        <meshBasicNodeMaterial side={2} {...nodes} />
      </mesh>
      {label && (
        <Html distanceFactor={15} center position-y={-1}>
          {label}
        </Html>
      )}
    </group>
  );
}
