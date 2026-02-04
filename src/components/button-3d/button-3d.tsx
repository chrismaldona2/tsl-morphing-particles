import { useGLTF } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useMemo } from "react"; // Removed useRef
import type { Mesh } from "three";
import { attribute, color, mix, positionLocal, uniform, vec3 } from "three/tsl";
import { type ButtonUniforms, buttonConfig as config } from "./config";
import { useButton3DControls } from "./use-button-3d-controls";

type ButtonGLB = {
  nodes: {
    button: Mesh;
  };
};

type ButtonProps = ThreeElements["mesh"] & {
  onClick?: (event: ThreeEvent<MouseEvent>) => void;
  disabled?: boolean;
};

export default function Button3D({ onClick, disabled, ...props }: ButtonProps) {
  const glb = useGLTF("/button.glb", "/draco/") as unknown as ButtonGLB;

  const { nodes, uniforms } = useMemo(() => {
    const uniforms: ButtonUniforms = {
      pressStrength: uniform(0),
      downDistance: uniform(vec3(0, -config.pressDepth, 0)),
      buttonColor: uniform(color(config.buttonColor)),
      buttonRoughness: uniform(config.buttonRoughness),
      buttonMetalness: uniform(config.buttonMetalness),
      baseColor: uniform(color(config.baseColor)),
      baseRoughness: uniform(config.baseRoughness),
      baseMetalness: uniform(config.baseMetalness),
    };

    /*
     * Button Mask - Separates the button from the base using Vertex Colors
     */
    const vertexColor = attribute("color", "vec4");
    const buttonMask = vertexColor.r;

    /*
     * Pressing Animation
     */
    const positionNode = positionLocal.add(
      uniforms.downDistance.mul(uniforms.pressStrength).mul(buttonMask),
    );

    /*
     * Color
     */
    const colorNode = mix(uniforms.baseColor, uniforms.buttonColor, buttonMask);

    /*
     * Roughness
     */
    const roughnessNode = mix(
      uniforms.baseRoughness,
      uniforms.buttonRoughness,
      buttonMask,
    );

    /*
     * Metalness
     */
    const metalnessNode = mix(
      uniforms.baseMetalness,
      uniforms.buttonMetalness,
      buttonMask,
    );

    return {
      nodes: {
        colorNode,
        positionNode,
        roughnessNode,
        metalnessNode,
      },
      uniforms,
    };
  }, []);

  const controls = useButton3DControls(uniforms);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (disabled) return;

    onClick?.(e);

    gsap.killTweensOf(uniforms.pressStrength);
    gsap.to(uniforms.pressStrength, {
      value: 1,
      duration: controls[0].pressDuration,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(uniforms.pressStrength, {
          value: 0,
          duration: controls[0].releaseDuration,
          ease: "power3.out",
        });
      },
    });
  };

  return (
    <mesh
      {...props}
      geometry={glb.nodes.button.geometry}
      onClick={handleClick}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      <meshStandardNodeMaterial {...nodes} />
    </mesh>
  );
}
