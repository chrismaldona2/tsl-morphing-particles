import { OrbitControls } from "@react-three/drei";
import { Leva } from "leva";
import { ui } from "./utils/tunnels";
import Canvas from "./components/canvas";
import Lights from "./components/lights";
import MorphScene from "./components/morph-particles/morph-scene";
import CreditOverlay from "./components/ui/credit-overlay";
import { customTheme } from "./utils/leva";

export default function App() {
  return (
    <>
      <ui.Out />

      <CreditOverlay className="bottom-0 left-0">
        Shader by{" "}
        <a href="" target="_blank" className="underline">
          Chris
        </a>{" "}
        &#40;
        <a href="" target="_blank" className="underline">
          Source Code
        </a>
        &#41;
      </CreditOverlay>

      <Leva theme={customTheme} hideCopyButton flat />
      <Canvas camera={{ position: [-2.53, 1.28, 4.76] }}>
        <OrbitControls makeDefault target={[0.68, -0.05, 0.31]} />
        <Lights />
        <MorphScene position={[0, -1, -1]} />
      </Canvas>
    </>
  );
}
