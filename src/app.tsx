import { OrbitControls, useGLTF, useTexture } from "@react-three/drei";
import { Leva } from "leva";
import { ui } from "./utils/tunnels";
import Canvas from "./components/canvas";
import Lights from "./components/lights";
import MorphShowcase from "./components/morph-particles/morph-showcase";
import CreditOverlay from "./components/ui/credit-overlay";
import { customTheme } from "./utils/leva";
import { Suspense } from "react";
import Loader from "./components/loader";
import StatsMonitor from "./components/stats-monitor";

export default function App() {
  return (
    <>
      <Loader />

      <ui.Out />

      <CreditOverlay className="bottom-0 left-0">
        Shader by{" "}
        <a
          href="https://x.com/chrismaldona2"
          target="_blank"
          className="underline"
        >
          Chris
        </a>{" "}
        &#40;
        <a
          href="https://github.com/chrismaldona2/tsl-morphing-particles"
          target="_blank"
          className="underline"
        >
          Source Code
        </a>
        &#41;
      </CreditOverlay>

      <Leva theme={customTheme} hideCopyButton flat />
      <Canvas camera={{ position: [-2.73, 1.28, 4.62] }}>
        <OrbitControls makeDefault target={[0.48, -0.05, 0.17]} />
        <StatsMonitor />
        <Lights />

        <Suspense fallback={null}>
          <MorphShowcase position={[0, -1, -1]} />
        </Suspense>
      </Canvas>
    </>
  );
}

useGLTF.preload("/models/models.glb", "/draco/");
useGLTF.preload("/models/button.glb", "/draco/");
useTexture.preload("/textures/noise.png");
