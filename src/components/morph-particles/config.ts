import type { UniformSet } from "../../types/uniforms";
import {
  AdditiveBlending,
  Mesh,
  TextureNode,
  type Blending,
} from "three/webgpu";

/*
 *
 * Material Config
 *
 */

// Particle style (Shape)
export type ParticleStyleParams = {
  particleSize: number;
  shapeRadius: number;
  shapeTurnOff: number;
  shapeHardness: number;
};

export const particleStyles: Record<string, ParticleStyleParams> = {
  glow: {
    particleSize: 0.1,
    shapeRadius: 0.05,
    shapeTurnOff: 0.1,
    shapeHardness: 1.0,
  },
  hard: {
    particleSize: 0.03,
    shapeRadius: 0.4,
    shapeTurnOff: 0.0,
    shapeHardness: 50.0,
  },
  smooth: {
    particleSize: 0.1,
    shapeRadius: 0.1,
    shapeTurnOff: 0.2,
    shapeHardness: 2.0,
  },
} as const;

export type ParticleStyleName = keyof typeof particleStyles;

// System Params
export type ParticlesSystemParams = {
  resolution: number;
  blending: Blending;
  depthWrite: boolean;
  wireframe: boolean;
};

// Shader Params
export type ParticlesAnimationParams = {
  meshA: number;
  meshB: number;
  animationProgress: number;
  animationDuration: number;
  animationSynchronization: number;
  animationChaosAmplitude: number;
  animationChaosFrequency: number;
  oscillationAmplitude: number;
  oscillationSpeed: number;
} & ParticleStyleParams;

export type ParticlesMorphParams = ParticlesSystemParams &
  ParticlesAnimationParams;

export const particlesMorphingConfig: ParticlesMorphParams = {
  // System
  resolution: 128,
  blending: AdditiveBlending,
  depthWrite: false,
  wireframe: false,

  // Shader
  meshA: 0,
  meshB: 1,
  animationProgress: 0,
  animationDuration: 2.15,
  animationSynchronization: 0.55,
  animationChaosAmplitude: 0.65,
  animationChaosFrequency: 0.2,
  oscillationAmplitude: 0.02,
  oscillationSpeed: 0.1,
  ...particleStyles.hard,
};

type NoUniformParams = "animationDuration"; // Excluded from the uniformsSet as it's managed outside the shader (gsap)

export type ParticlesMorphUniforms = UniformSet<
  Omit<ParticlesAnimationParams, NoUniformParams>
> & {
  mapA: TextureNode;
  mapB: TextureNode;
};

/*
 *
 * Models Data
 *
 */
export type ModelsGLB = {
  nodes: {
    crocodile: Mesh;
    fox: Mesh;
    mimic: Mesh;
    parrot: Mesh;
    plane: Mesh;
    r2d2: Mesh;
    rinho: Mesh;
  };
};

export type MeshName = keyof ModelsGLB["nodes"];

export type ModelCredit = {
  model: {
    title: string;
    url: string;
  };
  author: {
    name: string;
    profile: string;
  };
};
export const credits: Record<MeshName, ModelCredit> = {
  crocodile: {
    model: {
      title: "Crocodile",
      url: "https://sketchfab.com/3d-models/nile-crocodile-swimming-8bdc3a1551fb4d9d9a58e56b9385bd22",
    },
    author: {
      name: "Monster",
      profile: "https://sketchfab.com/monster",
    },
  },
  fox: {
    model: {
      title: "Fox",
      url: "https://sketchfab.com/3d-models/fox-4e37c303f8a241aaa2511bd9f3019273",
    },
    author: {
      name: "Alexei Ostapenko",
      profile: "https://sketchfab.com/alexanders823",
    },
  },
  mimic: {
    model: {
      title: "Mimic Chest",
      url: "https://sketchfab.com/3d-models/symbol-of-avarice-dark-souls-fanart-6dda892c5fca421b8b75e0c657af570d",
    },
    author: {
      name: "AlessioPassera",
      profile: "https://sketchfab.com/AlessioPassera",
    },
  },
  parrot: {
    model: {
      title: "Parrot",
      url: "https://sketchfab.com/3d-models/blue-and-yellow-macaw-ara-ararauna-027e6f37b2124bcab6a41635f6b5c699",
    },
    author: {
      name: "The Watt Institution",
      profile: "https://sketchfab.com/wattinstitution",
    },
  },
  plane: {
    model: {
      title: "Plane",
      url: "https://sketchfab.com/3d-models/supermarine-spitfire-8349f26e1e88455da75dd7352b02b794",
    },
    author: {
      name: "Renafox",
      profile: "https://sketchfab.com/kryik1023",
    },
  },
  r2d2: {
    model: {
      title: "R2-D2 Droid",
      url: "https://sketchfab.com/3d-models/r2d2-dcc7552a34734d7bad5c5c4f4373b050",
    },
    author: {
      name: "Lars Bracke",
      profile: "https://sketchfab.com/lars.bracke",
    },
  },
  rinho: {
    model: {
      title: "Rhino",
      url: "https://sketchfab.com/3d-models/model-56a-southern-white-rhino-8e97b62a90f44ce19ea9e3fd421f55b4",
    },
    author: {
      name: "DigitalLife3D",
      profile: "https://sketchfab.com/DigitalLife3D",
    },
  },
};
