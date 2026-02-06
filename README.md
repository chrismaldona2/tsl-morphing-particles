# Morphing Particles 🧬

A particle morphing experiment using **React Three Fiber** and **Three.js Shading Language (TSL)** (WebGPU).

This project showcases how to morph 16,000+ particles between arbitrary 3D models with minimal CPU overhead during the transition. It uses `DataArrayTexture` to store surface data, allowing for instantaneous switching between any number of meshes.

---

## Features

- **WebGPU / TSL:** Written entirely using the new Three.js Shading Language (Nodes).
- **GPU-Based Morphing:** All position and color calculations happen in the vertex shader.
- **Instanced Rendering:** Uses `InstancedMesh` for efficient draw calls.
- **Zero-Cost Switching:** Switch between 9+ models instantly without rebuilding geometry.
- **Physics Faking:** Includes curl noise, chaos displacement, and oscillation effects purely in the shader.

---

## How It Works

### 1. Surface Sampling

At startup, the app uses `MeshSurfaceSampler` to generate a uniform point cloud from the original 3D models. This process normalizes geometry density:

- **High-Poly (e.g., 50k vertices):** We strictly take 16k samples and ignore the rest, optimizing performance.
- **Low-Poly (e.g., 500 vertices):** We continue sampling random points on the surface faces until the 16k target is filled.
- **Result:** Every model, regardless of complexity, fits exactly into the `128x128` texture.

### 2. The Data Strategy (`DataArrayTexture`)

Instead of keeping geometry in CPU memory, we bake the sampled positions and UVs into **Texture Arrays**.

- **Layer 0:** Position data for "Crocodile"
- **Layer 1:** Position data for "R2D2"
- **Layer N:** Position data for "Mesh N"

This allows the shader to access any mesh's data simply by changing a texture layer index.

### 3. TSL Shader

The shader logic (in `use-morph-material.ts`) samples two texture layers (Current vs. Target) and mixes them based on an animation progress uniform.

```typescript
// TSL Pseudo-code
const shapeA = texture(positions, uv).depth(meshIndexA);
const shapeB = texture(positions, uv).depth(meshIndexB);
const finalPosition = mix(shapeA, shapeB, progress);
```

---

## Performance & Memory Scaling

### VRAM Calculation

The memory footprint scales linearly with the number of meshes and exponentially with resolution.

**Formula:**
`Total VRAM = (Resolution²) × (Mesh Count) × (Attributes) × (BytesPerFloat)`

**Example:**

- **Resolution:** 128 (16,384 particles)
- **Meshes:** 9
- **Attributes:** 2 (Positions + UVs)
- **Precision:** Float32 (16 bytes per pixel RGBA)

<p align="center">
  16,384 × 9 × 2 × 16 ≈ <strong>4.7 MB</strong>
</p>

### Fill Rate

While VRAM is cheap, **Fill Rate** (drawing pixels) is expensive.

- Since particles are transparent and additive, they cause Overdraw.
- If 50 particles overlap on a single pixel, the GPU runs the fragment shader and calculates blending math 50 times for that one dot.
- While desktop GPUs handle this easily, high-DPI mobile screens (often DPR 3.0+) can struggle with the massive fill rate. It is highly recommended to clamp the max DPR on mobile devices to significantly improve performance.
