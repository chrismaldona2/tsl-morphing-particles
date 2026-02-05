import {
  extend,
  Canvas as FiberCanvas,
  type CanvasProps,
} from "@react-three/fiber";
import {
  MeshBasicNodeMaterial,
  SpriteNodeMaterial,
  WebGPURenderer,
  MeshStandardNodeMaterial,
} from "three/webgpu";

extend({
  MeshBasicNodeMaterial: MeshBasicNodeMaterial,
  SpriteNodeMaterial: SpriteNodeMaterial,
  MeshStandardNodeMaterial: MeshStandardNodeMaterial,
});

export default function Canvas(props: CanvasProps) {
  return (
    <FiberCanvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100dvh",
        touchAction: "none",
      }}
      dpr={[1, 1.5]}
      gl={async (props) => {
        const renderer = new WebGPURenderer({
          canvas: props.canvas as HTMLCanvasElement,
          powerPreference: "high-performance",
          antialias: true,
          stencil: false,
          alpha: true,
        });
        await renderer.init();
        return renderer;
      }}
      {...props}
    />
  );
}
