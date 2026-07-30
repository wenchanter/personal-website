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
  entryBaseTarget: THREE.Vector3;
  entryTarget: THREE.Vector3;
  entryArc: THREE.Vector3;
  entryPreviousPosition: THREE.Vector3;
  entryExitVelocity: THREE.Vector3;
  entryDelay: number;
  hasEntered: boolean;
  collisionWeight: number;
};

const additionalBallSpecs = [
  {
    accent: "#db2777",
    tint: "#f9a8d4",
    icon: "/icons/typescript.svg",
    iconScale: [1.35, 0.68],
    label: "TypeScript",
  },
  {
    accent: "#7c3aed",
    tint: "#c4b5fd",
    icon: "/icons/dynamodb.svg",
    iconScale: [1.2, 0.95],
    label: "Amazon DynamoDB",
  },
  {
    accent: "#ea580c",
    tint: "#fdba74",
    icon: "/icons/kubernetes.svg",
    iconScale: [1.22, 0.92],
    label: "Kubernetes",
  },
  {
    accent: "#16a34a",
    tint: "#86efac",
    icon: "/icons/lua.svg",
    iconScale: [1.12, 1.12],
    label: "Lua",
  },
  {
    accent: "#4f46e5",
    tint: "#a5b4fc",
    icon: "/icons/mongodb.svg",
    iconScale: [1.5, 0.42],
    label: "MongoDB",
  },
  {
    accent: "#ca8a04",
    tint: "#fde047",
    icon: "/icons/postgresql.svg",
    iconScale: [1.15, 1.15],
    label: "PostgreSQL",
  },
  {
    accent: "#0f766e",
    tint: "#5eead4",
    icon: "/icons/python.svg",
    iconScale: [1.15, 1.15],
    label: "Python",
  },
  {
    accent: "#be123c",
    tint: "#fda4af",
    icon: "/icons/rocketmq.svg",
    iconScale: [1.5, 0.45],
    label: "Apache RocketMQ",
  },
  {
    accent: "#9333ea",
    tint: "#d8b4fe",
    icon: "/icons/nginx.png",
    iconScale: [1.12, 1.12],
    label: "Nginx",
  },
] as const;

const ballSpecs = [
  ...approachPaths.map((path, index) => ({
    icon: path.icon,
    iconScale: null,
    label: path.label,
    ...orbPalette[index],
  })),
  ...additionalBallSpecs,
] as const;

const MAX_DELTA = 1 / 30;
const ENTRY_DURATION = 1.05;
const ENTRY_STAGGER = 0.055;
const ENTRY_VELOCITY_SAMPLE_END = 0.82;
const COLLISION_HANDOFF_DURATION = 0.18;
const TARGET_GAP = 0.06;
const TARGET_RELAXATION_PASSES = 64;

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
    const bodies: BallBody[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    const iconImages: HTMLImageElement[] = [];
    let disposed = false;

    ballSpecs.forEach((spec, index) => {
      const radius = 0.53 + (index % 5) * 0.08;
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
        const iconMaterial = new THREE.SpriteMaterial({
          transparent: true,
          opacity: 0,
          depthTest: true,
          depthWrite: false,
          toneMapped: false,
        });
        const icon = new THREE.Sprite(iconMaterial);
        const defaultIconScale =
          spec.label === "Domain-Driven Design"
            ? 1.35
            : spec.label === "Apache Kafka"
              ? 1.05
              : 1.18;
        const [iconWidth, iconHeight] = spec.iconScale ?? [
          defaultIconScale,
          defaultIconScale,
        ];

        icon.scale.set(iconWidth, iconHeight, 1);
        icon.position.set(0, 0, 0);
        icon.renderOrder = 2;
        mesh.add(icon);
        materials.push(iconMaterial);

        /*
         * SVG images uploaded directly through TextureLoader can take different
         * browser/GPU paths. Chromium occasionally rejects that upload with
         * GL_INVALID_OPERATION, leaving a valid sprite with an empty texture.
         * Rasterising every source through the same transparent canvas gives
         * WebGL one predictable RGBA texture format for SVG and PNG alike.
         */
        const image = new Image();
        iconImages.push(image);
        image.decoding = "async";
        image.addEventListener(
          "load",
          () => {
            if (disposed) {
              return;
            }

            const rasterSize = 512;
            const canvas = document.createElement("canvas");
            canvas.width = rasterSize;
            canvas.height = rasterSize;

            const context = canvas.getContext("2d");

            if (!context) {
              return;
            }

            context.clearRect(0, 0, rasterSize, rasterSize);
            context.drawImage(image, 0, 0, rasterSize, rasterSize);

            const texture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;
            textures.push(texture);

            iconMaterial.map = texture;
            iconMaterial.opacity = 1;
            iconMaterial.needsUpdate = true;
            renderer.render(scene, camera);
          },
          { once: true },
        );
        image.src = spec.icon;
      }

      bodies.push({
        mesh,
        radius,
        velocity: new THREE.Vector3(
          Math.sin(index * 1.73) * 0.68,
          Math.cos(index * 1.21) * 0.6,
          Math.sin(index * 0.91) * 0.17,
        ),
        phase: index * 0.83,
        entryFrom: new THREE.Vector3(),
        entryBaseTarget: mesh.position.clone(),
        entryTarget: mesh.position.clone(),
        entryArc: new THREE.Vector3(),
        entryPreviousPosition: new THREE.Vector3(),
        entryExitVelocity: new THREE.Vector3(),
        entryDelay: index * ENTRY_STAGGER,
        hasEntered: false,
        collisionWeight: 0,
      });
    });

    const targetDifference = new THREE.Vector3();
    const collisionDifference = new THREE.Vector3();
    const relativeVelocity = new THREE.Vector3();
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

    const layoutEntryTargets = () => {
      bodies.forEach((body) => {
        body.entryTarget.copy(body.entryBaseTarget);
      });

      for (
        let pass = 0;
        pass < TARGET_RELAXATION_PASSES;
        pass += 1
      ) {
        for (let index = 0; index < bodies.length; index += 1) {
          const first = bodies[index];

          for (
            let otherIndex = index + 1;
            otherIndex < bodies.length;
            otherIndex += 1
          ) {
            const second = bodies[otherIndex];
            targetDifference
              .copy(second.entryTarget)
              .sub(first.entryTarget);
            let distance = targetDifference.length();
            const minimumDistance =
              first.radius + second.radius + TARGET_GAP;

            if (distance >= minimumDistance) {
              continue;
            }

            if (distance < 0.0001) {
              targetDifference.set(
                Math.cos(index + otherIndex),
                Math.sin(index + otherIndex),
                0.1,
              );
              distance = targetDifference.length();
            }

            const correction =
              (minimumDistance - distance) / (distance * 2);

            first.entryTarget.addScaledVector(
              targetDifference,
              -correction,
            );
            second.entryTarget.addScaledVector(
              targetDifference,
              correction,
            );
          }
        }

        bodies.forEach((body) => {
          body.entryTarget.x = THREE.MathUtils.clamp(
            body.entryTarget.x,
            -boundsX + body.radius,
            boundsX - body.radius,
          );
          body.entryTarget.y = THREE.MathUtils.clamp(
            body.entryTarget.y,
            -boundsY + body.radius,
            boundsY - body.radius,
          );
          body.entryTarget.z = THREE.MathUtils.clamp(
            body.entryTarget.z,
            -1.6 + body.radius * 0.2,
            1.6 - body.radius * 0.2,
          );
        });
      }
    };

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
        if (!entryStarted) {
          layoutEntryTargets();
        }

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
            body.entryPreviousPosition.copy(body.entryFrom);
          }
        });
      }

      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.render(scene, camera);
    };

    const resolveCollisions = (activeBodies = bodies) => {
      for (let index = 0; index < activeBodies.length; index += 1) {
        const first = activeBodies[index];

        for (
          let otherIndex = index + 1;
          otherIndex < activeBodies.length;
          otherIndex += 1
        ) {
          const second = activeBodies[otherIndex];
          const difference = collisionDifference
            .copy(second.mesh.position)
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
          const responseWeight = Math.min(
            first.collisionWeight,
            second.collisionWeight,
          );

          if (responseWeight <= 0) {
            continue;
          }

          first.mesh.position.addScaledVector(
            normal,
            -overlap * 0.5 * responseWeight,
          );
          second.mesh.position.addScaledVector(
            normal,
            overlap * 0.5 * responseWeight,
          );

          relativeVelocity.copy(second.velocity).sub(first.velocity);
          const speedAlongNormal = relativeVelocity.dot(normal);

          if (speedAlongNormal < 0) {
            const impulse =
              (-(1.76 * speedAlongNormal) / 2) * responseWeight;
            first.velocity.addScaledVector(normal, -impulse);
            second.velocity.addScaledVector(normal, impulse);
          }
        }
      }
    };

    const updateBody = (body: BallBody, delta: number, elapsed: number) => {
      const position = body.mesh.position;
      const centerPull = 0.42;

      body.collisionWeight = Math.min(
        1,
        body.collisionWeight + delta / COLLISION_HANDOFF_DURATION,
      );
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

    const updateEntry = (time: number, delta: number, elapsed: number) => {
      const entryElapsed = (time - entryStartTime) / 1000;
      const enteredBodies: BallBody[] = [];
      let allArrived = true;

      bodies.forEach((body) => {
        const rawProgress = THREE.MathUtils.clamp(
          (entryElapsed - body.entryDelay) / ENTRY_DURATION,
          0,
          1,
        );
        const easedProgress = 1 - Math.pow(1 - rawProgress, 3);

        if (rawProgress < 1) {
          allArrived = false;
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

          if (
            rawProgress > 0 &&
            rawProgress <= ENTRY_VELOCITY_SAMPLE_END &&
            delta > 0
          ) {
            body.entryExitVelocity
              .copy(body.mesh.position)
              .sub(body.entryPreviousPosition)
              .multiplyScalar(1 / delta);

            const sampledSpeed = body.entryExitVelocity.length();

            if (sampledSpeed > 0.001) {
              body.entryExitVelocity
                .multiplyScalar(1 / sampledSpeed)
                .multiplyScalar(
                  THREE.MathUtils.clamp(sampledSpeed, 0.65, 1.1),
                );
            }
          }

          body.entryPreviousPosition.copy(body.mesh.position);
          return;
        }

        if (!body.hasEntered) {
          body.hasEntered = true;
          body.mesh.position.copy(body.entryTarget);

          if (body.entryExitVelocity.lengthSq() > 0.0001) {
            body.velocity.copy(body.entryExitVelocity);
          }
        }

        // Hand each body to physics as soon as its own entrance finishes.
        // Waiting for every staggered entrance creates a visible pause.
        enteredBodies.push(body);
        updateBody(body, delta, elapsed);
      });

      resolveCollisions(enteredBodies);
      resolveCollisions(enteredBodies);

      if (!allArrived) {
        return;
      }

      entryComplete = true;
    };

    const renderFrame = (time: number) => {
      if (!isVisible) {
        return;
      }

      const delta = Math.min((time - lastTime) / 1000, MAX_DELTA);
      const elapsed = time / 1000;
      lastTime = time;

      if (!entryComplete) {
        updateEntry(time, delta, elapsed);
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
      const visibleTop = Math.max(rect.top, 0);
      const visibleBottom = Math.min(rect.bottom, window.innerHeight);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const availableHeight = Math.min(rect.height, window.innerHeight);
      const isFullyPresented =
        availableHeight > 0 && visibleHeight >= availableHeight * 0.96;

      if (!isFullyPresented) {
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
      disposed = true;
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      iconImages.forEach((image) => {
        image.src = "";
      });

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
