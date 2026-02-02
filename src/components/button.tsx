import { useGLTF } from "@react-three/drei";
import type { ThreeElements, ThreeEvent } from "@react-three/fiber";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import type { Mesh } from "three";
import { attribute, color, mix, positionLocal, uniform, vec3 } from "three/tsl";

type ButtonGLB = {
  nodes: {
    button: Mesh;
  };
};

type ButtonProps = ThreeElements["mesh"] & {
  onClick?: (event: ThreeEvent<MouseEvent>) => void | Promise<void>;
  disabled?: boolean;
};

export default function Button({ onClick, disabled, ...props }: ButtonProps) {
  const glb = useGLTF("/button.glb", "/draco/") as unknown as ButtonGLB;
  const isWaiting = useRef(false);

  const { nodes, uniforms } = useMemo(() => {
    const uniforms = {
      pressStrength: uniform(0),
      downDistance: uniform(vec3(0, -0.25, 0)),
      buttonColor: uniform(color("#fa3a4a")),
      buttonRoughness: uniform(0.75),
      buttonMetalness: uniform(0),
      baseColor: uniform(color("#3c3c3c")),
      baseRoughness: uniform(0.4),
      baseMetalness: uniform(0.5),
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

  const handleClick = async (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (disabled || isWaiting.current) return;

    isWaiting.current = true;

    gsap.killTweensOf(uniforms.pressStrength);
    gsap.to(uniforms.pressStrength, {
      value: 1,
      duration: 0.15,
      ease: "power2.out",
    });

    try {
      await onClick?.(e);
    } finally {
      gsap.to(uniforms.pressStrength, {
        value: 0,
        duration: 0.4,
        ease: "power3.out",
        onComplete: () => {
          isWaiting.current = false;
        },
      });
    }
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
