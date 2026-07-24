"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { approachPaths, orbPalette } from "@/app/data/orbs";

type BallBody = {
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshPhysicalMaterial>;
  radius: number;
  velocity: THREE.Vector3;
  phase: number;
  entryFrom: THREE.Vector3;
  entryTarget: THREE.Vector3;
  entryArc: THREE.Vector3;
  entryDelay: number;
};

const additionalBallColors = [
  { accent: "#db2777", tint: "#f9a8d4" },
  { accent: "#7c3aed", tint: "#c4b5fd" },
  { accent: "#ea580c", tint: "#fdba74" },
  { accent: "#16a34a", tint: "#86efac" },
  { accent: "#4f46e5", tint: "#a5b4fc" },
  { accent: "#ca8a04", tint: "#fde047" },
  { accent: "#0f766e", tint: "#5eead4" },
  { accent: "#be123c", tint: "#fda4af" },
  { accent: "#9333ea", tint: "#d8b4fe" },
] as const;

const ballSpecs = [
  ...approachPaths.map((path, index) => ({
    icon: path.icon,
    label: path.label,
    ...orbPalette[index],
  })),
  ...additionalBallColors.map((colors, index) => ({
    ...colors,
    icon: null,
    label: `Decorative sphere ${index + 1}`,
  })),
] as const;

const MAX_DELTA = 1 / 30;
const ENTRY_DURATION = 1.05;
const ENTRY_STAGGER = 0.055;

const entryDirections = [
  new THREE.Vector2(-1, -0.72),
  new THREE.Vector2(-0.2, -1),
  new THREE.Vector2(0.72, -1),
  new THREE.Vector2(1, -0.34),
  new THREE.Vector2(1, 0.7),
  new THREE.Vector2(0.24, 1),
  new THREE.Vector2(-0.72, 1),
  new THREE.Vector2(-1, 0.3),
] as const;

export default function ContactBallPit() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-5, 5, 5, -5, 0.1, 50);
    camera.position.set(0, 0, 16);

    const rendererCanvas = document.createElement("canvas");
    const rendererContext = rendererCanvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!rendererContext) {
      root.dataset.webglUnavailable = "true";
      return;
    }

    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas: rendererCanvas,
        context: rendererContext,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      root.dataset.webglUnavailable = "true";
      return;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.className =
      "contact-ball-canvas h-full w-full touch-none";
    renderer.domElement.setAttribute("aria-hidden", "true");
    root.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xdbeafe, 2.6));

    const keyLight = new THREE.DirectionalLight(0xffffff, 4.8);
    keyLight.position.set(-5, 7, 10);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x93c5fd, 22, 28);
    rimLight.position.set(7, -2, 8);
    scene.add(rimLight);

    const warmLight = new THREE.PointLight(0xfde68a, 16, 24);
    warmLight.position.set(-7, -4, 5);
    scene.add(warmLight);

    const geometry = new THREE.SphereGeometry(1, 48, 32);
    const textureLoader = new THREE.TextureLoader();
    const bodies: BallBody[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    ballSpecs.forEach((spec, index) => {
      const radius = 0.46 + (index % 5) * 0.07;
      const material = new THREE.MeshPhysicalMaterial({
        color: spec.tint,
        emissive: spec.accent,
        emissiveIntensity: 0.055,
        metalness: 0.02,
        roughness: 0.12,
        transmission: 0.26,
        transparent: true,
        opacity: 0.62,
        clearcoat: 1,
        clearcoatRoughness: 0.06,
        ior: 1.42,
        thickness: 0.75,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      const angle = index * 2.399963;
      const distance = 0.55 + Math.sqrt(index) * 0.52;

      mesh.scale.setScalar(radius);
      mesh.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance * 0.72,
        ((index % 5) - 2) * 0.18,
      );
      mesh.rotation.set(index * 0.17, index * 0.11, index * -0.13);
      scene.add(mesh);
      materials.push(material);

      if (spec.icon) {
        const texture = textureLoader.load(spec.icon);
        texture.colorSpace = THREE.SRGBColorSpace;
        textures.push(texture);

        const iconMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          depthTest: true,
          depthWrite: false,
          toneMapped: false,
        });
        const icon = new THREE.Sprite(iconMaterial);
        const iconScale =
          spec.label === "Domain-Driven Design"
            ? 1.35
            : spec.label === "Apache Kafka"
              ? 1.05
              : 1.18;

        icon.scale.set(iconScale, iconScale, 1);
        icon.position.set(0, 0, 0);
        icon.renderOrder = 2;
        mesh.add(icon);
        materials.push(iconMaterial);
      }

      bodies.push({
        mesh,
        radius,
        velocity: new THREE.Vector3(
          Math.sin(index * 1.73) * 0.32,
          Math.cos(index * 1.21) * 0.28,
          Math.sin(index * 0.91) * 0.09,
        ),
        phase: index * 0.83,
        entryFrom: new THREE.Vector3(),
        entryTarget: mesh.position.clone(),
        entryArc: new THREE.Vector3(),
        entryDelay: index * ENTRY_STAGGER,
      });
    });

    const pointer = new THREE.Vector2(100, 100);
    let pointerActive = false;
    let frameId = 0;
    let isVisible = false;
    let lastTime = performance.now();
    let boundsX = 5;
    let boundsY = 4.2;
    let entryStarted = false;
    let entryComplete = false;
    let entryStartTime = 0;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();

      if (width === 0 || height === 0) {
        return;
      }

      const aspect = width / height;
      const viewHeight = width < 640 ? 18.5 : 9.6;
      const viewWidth = viewHeight * aspect;

      camera.left = -viewWidth / 2;
      camera.right = viewWidth / 2;
      camera.top = viewHeight / 2;
      camera.bottom = -viewHeight / 2;
      camera.updateProjectionMatrix();

      boundsX = viewWidth * 0.43;
      boundsY = viewHeight * 0.41;

      if (!entryComplete) {
        bodies.forEach((body, index) => {
          const direction =
            entryDirections[index % entryDirections.length].clone().normalize();
          const halfWidth = viewWidth / 2;
          const halfHeight = viewHeight / 2;
          const edgePadding = body.radius * 2.4;
          const distanceToVerticalEdge =
            Math.abs(direction.x) > 0.001
              ? (halfWidth + edgePadding) / Math.abs(direction.x)
              : Number.POSITIVE_INFINITY;
          const distanceToHorizontalEdge =
            Math.abs(direction.y) > 0.001
              ? (halfHeight + edgePadding) / Math.abs(direction.y)
              : Number.POSITIVE_INFINITY;
          const entryDistance = Math.min(
            distanceToVerticalEdge,
            distanceToHorizontalEdge,
          );

          body.entryFrom.set(
            direction.x * entryDistance,
            direction.y * entryDistance,
            body.entryTarget.z + ((index % 3) - 1) * 0.45,
          );
          body.entryArc
            .set(-direction.y, direction.x, 0)
            .multiplyScalar((index % 2 === 0 ? 1 : -1) * (0.35 + (index % 4) * 0.08));

          if (!entryStarted) {
            body.mesh.position.copy(body.entryFrom);
          }
        });
      }

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.render(scene, camera);
    };

    const resolveCollisions = () => {
      for (let index = 0; index < bodies.length; index += 1) {
        const first = bodies[index];

        for (
          let otherIndex = index + 1;
          otherIndex < bodies.length;
          otherIndex += 1
        ) {
          const second = bodies[otherIndex];
          const difference = second.mesh.position
            .clone()
            .sub(first.mesh.position);
          const minimumDistance = first.radius + second.radius;
          const distanceSquared = difference.lengthSq();

          if (
            distanceSquared >= minimumDistance * minimumDistance ||
            distanceSquared === 0
          ) {
            continue;
          }

          const distance = Math.sqrt(distanceSquared);
          const normal = difference.multiplyScalar(1 / distance);
          const overlap = minimumDistance - distance;

          first.mesh.position.addScaledVector(normal, -overlap * 0.5);
          second.mesh.position.addScaledVector(normal, overlap * 0.5);

          const relativeVelocity = second.velocity
            .clone()
            .sub(first.velocity);
          const speedAlongNormal = relativeVelocity.dot(normal);

          if (speedAlongNormal < 0) {
            const impulse = -(1.76 * speedAlongNormal) / 2;
            first.velocity.addScaledVector(normal, -impulse);
            second.velocity.addScaledVector(normal, impulse);
          }
        }
      }
    };

    const updateBody = (body: BallBody, delta: number, elapsed: number) => {
      const position = body.mesh.position;
      const centerPull = 0.42;

      body.velocity.x +=
        (-position.x * centerPull +
          Math.sin(elapsed * 0.96 + body.phase) * 0.11) *
        delta;
      body.velocity.y +=
        (-position.y * centerPull +
          Math.cos(elapsed * 0.84 + body.phase) * 0.1) *
        delta;
      body.velocity.z += -position.z * 0.54 * delta;

      if (pointerActive && entryComplete) {
        const offsetX = position.x - pointer.x;
        const offsetY = position.y - pointer.y;
        const distanceSquared = offsetX * offsetX + offsetY * offsetY;
        const influenceRadius = 2.85;

        if (distanceSquared < influenceRadius * influenceRadius) {
          const distance = Math.max(Math.sqrt(distanceSquared), 0.08);
          const strength = (1 - distance / influenceRadius) * 17.5 * delta;
          body.velocity.x += (offsetX / distance) * strength;
          body.velocity.y += (offsetY / distance) * strength;
        }
      }

      body.velocity.multiplyScalar(Math.pow(0.991, delta * 60));
      position.addScaledVector(body.velocity, delta);

      const horizontalLimit = boundsX - body.radius;
      const verticalLimit = boundsY - body.radius;

      if (Math.abs(position.x) > horizontalLimit) {
        position.x = THREE.MathUtils.clamp(
          position.x,
          -horizontalLimit,
          horizontalLimit,
        );
        body.velocity.x *= -0.72;
      }

      if (Math.abs(position.y) > verticalLimit) {
        position.y = THREE.MathUtils.clamp(
          position.y,
          -verticalLimit,
          verticalLimit,
        );
        body.velocity.y *= -0.72;
      }

      if (Math.abs(position.z) > 1.6) {
        position.z = THREE.MathUtils.clamp(position.z, -1.6, 1.6);
        body.velocity.z *= -0.7;
      }

      body.mesh.rotation.x += body.velocity.y * delta * 0.18;
      body.mesh.rotation.y -= body.velocity.x * delta * 0.18;
    };

    const updateEntry = (time: number) => {
      const entryElapsed = (time - entryStartTime) / 1000;
      let allArrived = true;

      bodies.forEach((body) => {
        const rawProgress = THREE.MathUtils.clamp(
          (entryElapsed - body.entryDelay) / ENTRY_DURATION,
          0,
          1,
        );
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

        body.mesh.position.lerpVectors(
          body.entryFrom,
          body.entryTarget,
          easedProgress,
        );
        body.mesh.position.addScaledVector(
          body.entryArc,
          Math.sin(Math.PI * easedProgress),
        );
        body.mesh.rotation.x += 0.012 + body.phase * 0.00008;
        body.mesh.rotation.y -= 0.016;

        if (rawProgress < 1) {
          allArrived = false;
        }
      });

      if (!allArrived) {
        return;
      }

      entryComplete = true;
      bodies.forEach((body, index) => {
        body.mesh.position.copy(body.entryTarget);
        body.velocity.set(
          Math.sin(index * 1.73) * 0.68,
          Math.cos(index * 1.21) * 0.6,
          Math.sin(index * 0.91) * 0.17,
        );
      });
    };

    const renderFrame = (time: number) => {
      if (!isVisible) {
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, MAX_DELTA);
      const elapsed = time / 1000;
      lastTime = time;

      if (!entryComplete) {
        updateEntry(time);
      } else {
        bodies.forEach((body) => updateBody(body, delta, elapsed));
        resolveCollisions();
        resolveCollisions();
      }

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const start = () => {
      if (frameId || !isVisible || !entryStarted) {
        return;
      }

      lastTime = performance.now();
      frameId = window.requestAnimationFrame(renderFrame);
    };

    const stop = () => {
      window.cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();

      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        pointerActive = false;
        return;
      }

      const normalizedX = (event.clientX - rect.left) / rect.width;
      const normalizedY = (event.clientY - rect.top) / rect.height;

      pointer.set(
        THREE.MathUtils.lerp(camera.left, camera.right, normalizedX),
        THREE.MathUtils.lerp(camera.top, camera.bottom, normalizedY),
      );
      pointerActive = true;
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startEntryIfReady = () => {
      if (entryStarted) {
        return;
      }

      const rect = root.getBoundingClientRect();

      if (rect.top > 1 || rect.bottom <= 0) {
        return;
      }

      entryStarted = true;

      if (reducedMotion) {
        entryComplete = true;
        bodies.forEach((body) => {
          body.mesh.position.copy(body.entryTarget);
        });
        renderer.render(scene, camera);
        return;
      }

      entryStartTime = performance.now();
      start();
    };
    const onScroll = () => {
      startEntryIfReady();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;

        if (!isVisible) {
          stop();
          renderer.render(scene, camera);
          return;
        }

        startEntryIfReady();

        if (entryStarted && !reducedMotion) {
          start();
        }

        renderer.render(scene, camera);
      },
      { threshold: 0 },
    );

    window.addEventListener("pointermove", onPointerMove, {
      passive: true,
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    resizeObserver.observe(root);
    intersectionObserver.observe(root);
    resize();
    startEntryIfReady();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);

      bodies.forEach(({ mesh }) => {
        scene.remove(mesh);
      });
      geometry.dispose();
      materials.forEach((material) => material.dispose());
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    />
  );
}
