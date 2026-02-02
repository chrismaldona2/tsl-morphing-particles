import { OrbitControls, Stats } from "@react-three/drei";
import { Leva } from "leva";
import { ui } from "./utils/tunnels";
import Canvas from "./components/canvas";
import Lights from "./components/lights";
import MorphParticles from "./components/morph-particles/morph-particles";
import { CreditOverlay } from "./components/credit-overlay";

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

      <Leva theme={{ sizes: { rootWidth: "20rem" } }} hideCopyButton />
      <Canvas camera={{ position: [4, 4, 4] }}>
        <OrbitControls />
        <MorphParticles position={[0, -1, -1]} />
        <Lights />
        <Stats />
      </Canvas>
    </>
  );
}
