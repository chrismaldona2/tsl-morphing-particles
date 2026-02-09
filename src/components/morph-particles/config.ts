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
  particleGlowSpread: number;
  particleAlphaCutoff: number;
  particleSharpness: number;
};

export const particleStyles: Record<string, ParticleStyleParams> = {
  glow: {
    particleSize: 0.1,
    particleGlowSpread: 0.05,
    particleAlphaCutoff: 0.1,
    particleSharpness: 1.0,
  },
  hard: {
    particleSize: 0.05,
    particleGlowSpread: 0.4,
    particleAlphaCutoff: 0.25,
    particleSharpness: 5.0,
  },
  smooth: {
    particleSize: 0.1,
    particleGlowSpread: 0.1,
    particleAlphaCutoff: 0.2,
    particleSharpness: 2.0,
  },
} as const;

export type ParticleStyleName = keyof typeof particleStyles;

// System Params
export type ParticlesSystemParams = {
  resolution: number;
  transparent: boolean;
  blending: Blending;
  depthWrite: boolean;
  wireframe: boolean;
  alphaToCoverage: boolean;
};

// Shader Params
export type ParticlesAnimationParams = {
  meshAIndex: number;
  meshBIndex: number;
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
  /*
   * 'Resolution' defines the dimensions (width x height) of the DataTexture
   * The relationship is strictly 1:1 between pixels and particles
   * Each pixel stores the data (Position, Scale) for exactly one particle
   * Total Particles = resolution * resolution
   */
  resolution: 128,
  transparent: false,
  blending: AdditiveBlending,
  depthWrite: false,
  wireframe: false,
  alphaToCoverage: false,

  // Shader
  meshAIndex: 4,
  meshBIndex: 8,
  animationProgress: 0,
  animationDuration: 2,
  animationSynchronization: 0.55,
  animationChaosAmplitude: 0.65,
  animationChaosFrequency: 0.2,
  oscillationAmplitude: 0.02,
  oscillationSpeed: 0.1,
  ...particleStyles.hard,
};

export const morphingDebugFolderName = "🧬 Morphing";

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
    macaw: Mesh;
    plane: Mesh;
    r2d2: Mesh;
    rhino: Mesh;
    cat: Mesh;
    parrots: Mesh;
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
  macaw: {
    model: {
      title: "Macaw",
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
  rhino: {
    model: {
      title: "Rhino",
      url: "https://sketchfab.com/3d-models/model-56a-southern-white-rhino-8e97b62a90f44ce19ea9e3fd421f55b4",
    },
    author: {
      name: "DigitalLife3D",
      profile: "https://sketchfab.com/DigitalLife3D",
    },
  },
  parrots: {
    model: {
      title: "Parrots",
      url: "https://sketchfab.com/3d-models/parrots-of-the-caribbean-f23c612a59d24a5c967ce62a9d0b1984",
    },
    author: {
      name: "Eleni Kofekidou",
      profile: "https://sketchfab.com/EleniKofekidou",
    },
  },
  cat: {
    model: {
      title: "Cat",
      url: "https://sketchfab.com/3d-models/bengal-cat-6d82596b5db94f7b9093814a4a88caa9",
    },
    author: {
      name: "ItsKrish7",
      profile: "https://sketchfab.com/ItsKrish7",
    },
  },
};
