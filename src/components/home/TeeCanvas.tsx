"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DecalGeometry } from "three/examples/jsm/geometries/DecalGeometry.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

/**
 * One WebGL canvas for every hero tee. The sculpted model (knit normal map +
 * baked occlusion) loads once; switching variants cross-fades the fabric
 * colour and the chest print instead of spinning up another scene.
 *
 * Drag (mouse) or swipe (touch) spins the tee with inertia; when idle it
 * auto-rotates and the hem/sleeves ripple in a light breeze. Rendering pauses
 * while the canvas is off-screen or the tab is hidden.
 *
 * Model: public/uploads/hero/tshirt.glb — MIT, see tshirt.LICENSE.txt.
 */

export type TeeVariant = {
  id: string;
  /** Fabric colour. */
  color: string;
  /** Transparent artwork image. */
  print: string;
  /** Print width on the chest, in model units (the tee is ~0.55 wide). */
  printWidth: number;
  /** Vertical centre of the print, in model units. */
  printY: number;
};

type Props = {
  variants: TeeVariant[];
  index: number;
  /** Fired once the model is on screen, so the poster can fade out. */
  onReady: () => void;
};

const MODEL_SRC = "/uploads/hero/tshirt.glb";
// Model bounds after dequantizing: y -0.352 … 0.261, chest surface near z 0.144.
const CENTER_Y = -0.045;
const CAMERA_Z = 1.65;

export default function TeeCanvas({ variants, index, onReady }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(index);
  const spinRef = useRef<() => void>(() => {});
  const readyRef = useRef(onReady);

  useEffect(() => {
    readyRef.current = onReady;
  }, [onReady]);

  useEffect(() => {
    if (indexRef.current !== index) spinRef.current();
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    const el = renderer.domElement;
    el.style.touchAction = "pan-y";
    el.className = "h-full w-full cursor-grab active:cursor-grabbing";
    wrap.appendChild(el);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 20);
    camera.position.set(0, 0, CAMERA_Z);

    scene.add(new THREE.HemisphereLight(0xfff4ea, 0x2a1a15, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.6);
    key.position.set(0.8, 1.2, 1.6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd2603f, 2);
    rim.position.set(-1.5, 0.5, -1.2);
    scene.add(rim);

    const uniforms = { uTime: { value: 0 } };
    const pivot = new THREE.Group();
    pivot.position.y = -CENTER_Y;
    scene.add(pivot);

    const disposables: { dispose(): void }[] = [];
    let fabric: THREE.MeshStandardMaterial | null = null;
    const decals: THREE.MeshStandardMaterial[] = [];
    const targetColor = new THREE.Color(variants[indexRef.current].color);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(MODEL_SRC, (gltf) => {
      if (disposed) return;
      const src = gltf.scene.getObjectByProperty("type", "Mesh") as THREE.Mesh | undefined;
      if (!src) return;

      // Bake the node transform and undo mesh quantization so the decal
      // projector and the breeze shader both work in plain model units.
      src.updateWorldMatrix(true, false);
      const geo = dequantize(src.geometry);
      geo.applyMatrix4(src.matrixWorld);

      fabric = (src.material as THREE.MeshStandardMaterial).clone();
      fabric.color.copy(targetColor);
      fabric.roughness = 0.9;
      addBreeze(fabric, uniforms);
      const shirt = new THREE.Mesh(geo, fabric);
      pivot.add(shirt);
      disposables.push(geo, fabric);

      const texLoader = new THREE.TextureLoader();
      const prints = variants.map(async (v, i) => {
        const tex = await texLoader.loadAsync(v.print);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        const img = tex.image as HTMLImageElement;
        const decalGeo = new DecalGeometry(
          shirt,
          new THREE.Vector3(0, v.printY, 0.15),
          new THREE.Euler(),
          new THREE.Vector3(v.printWidth, (v.printWidth * img.height) / img.width, 0.3),
        );
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          transparent: true,
          opacity: i === indexRef.current ? 1 : 0,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -4,
          roughness: 0.95,
        });
        addBreeze(mat, uniforms);
        decals[i] = mat;
        pivot.add(new THREE.Mesh(decalGeo, mat));
        disposables.push(tex, decalGeo, mat);
      });

      // Reveal only once every print is on the shirt and all shaders are
      // compiled — otherwise the bare model pops in and hitches on first frame.
      Promise.all(prints)
        .then(() => renderer.compileAsync(scene, camera))
        .then(() => {
          if (disposed) return;
          renderer.render(scene, camera);
          requestAnimationFrame(() => !disposed && readyRef.current());
        })
        .catch(() => !disposed && readyRef.current());
    });

    // ── drag / swipe to spin ────────────────────────────────────────────
    let rotY = -0.5;
    let rotX = 0.05;
    let velY = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let lastInput = -Infinity;

    spinRef.current = () => {
      // a flick of rotation makes the variant swap feel physical
      if (!reduced) velY += 0.16;
      targetColor.set(variants[indexRef.current].color);
    };

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velY = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      velY = (e.clientX - lastX) * 0.011;
      rotY += velY;
      if (e.pointerType === "mouse") {
        rotX = THREE.MathUtils.clamp(rotX + (e.clientY - lastY) * 0.006, -0.4, 0.4);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastInput = performance.now();
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      lastInput = performance.now();
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.position.z = w / h < 1 ? CAMERA_Z / Math.max(w / h, 0.6) : CAMERA_Z;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting));
    io.observe(wrap);

    // ── loop ────────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!onScreen || document.hidden) return;

      if (!dragging) {
        velY *= Math.pow(0.04, dt); // inertia after a flick
        rotY += velY;
        if (!reduced && performance.now() - lastInput > 1800) {
          rotY += dt * 0.35;
          rotX += (0.05 - rotX) * dt * 1.5;
        }
      }

      const blend = reduced ? 1 : 1 - Math.pow(0.002, dt);
      fabric?.color.lerp(targetColor, blend);
      decals.forEach((m, i) => {
        m.opacity += ((i === indexRef.current ? 1 : 0) - m.opacity) * blend;
        m.visible = m.opacity > 0.01;
      });

      if (!reduced) uniforms.uTime.value += dt;
      pivot.rotation.set(rotX, rotY, 0);
      pivot.position.y = -CENTER_Y + (reduced ? 0 : Math.sin(uniforms.uTime.value * 1.1) * 0.008);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      el.remove();
    };
  }, [variants]);

  return <div ref={wrapRef} className="h-full w-full" />;
}

/** Copy every quantized (normalized integer) attribute into plain floats. */
function dequantize(source: THREE.BufferGeometry) {
  const geo = source.clone();
  for (const [name, attr] of Object.entries(geo.attributes)) {
    const plain = attr instanceof THREE.BufferAttribute && !attr.normalized && attr.array instanceof Float32Array;
    if (plain) continue;
    const out = new Float32Array(attr.count * attr.itemSize);
    for (let i = 0; i < attr.count; i++) {
      for (let k = 0; k < attr.itemSize; k++) out[i * attr.itemSize + k] = attr.getComponent(i, k);
    }
    geo.setAttribute(name, new THREE.BufferAttribute(out, attr.itemSize));
  }
  return geo;
}

/** Soft breeze: the hem and sleeves ripple, shoulders stay put. Shared by shirt and prints. */
function addBreeze(mat: THREE.Material, uniforms: { uTime: { value: number } }) {
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = uniforms.uTime;
    shader.vertexShader = shader.vertexShader
      .replace(
        "#include <common>",
        `#include <common>
        uniform float uTime;
        float breezeAmp(vec3 p) {
          float hem = smoothstep(0.12, -0.36, p.y);
          float sleeve = smoothstep(0.17, 0.27, abs(p.x));
          return 0.006 * (0.2 + hem) + 0.006 * sleeve;
        }`,
      )
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        {
          float a = breezeAmp(position);
          transformed.z += sin(position.y * 16.0 + position.x * 7.0 - uTime * 2.4) * a;
          transformed.x += sin(uTime * 1.7 + position.y * 9.0) * 0.003 * smoothstep(0.05, -0.36, position.y);
        }`,
      );
  };
}
