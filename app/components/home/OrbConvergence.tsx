import Image from "next/image";

import FlowingOrb from "@/app/components/home/FlowingOrb";

export const approachPaths = [
  {
    className: "converging-orb-large",
    fromX: "-48vw",
    fromY: "-44vh",
    icon: "/icons/java.svg",
    label: "Java",
    rotation: -72,
  },
  {
    className: "converging-orb-medium",
    fromX: "48vw",
    fromY: "-38vh",
    icon: "/icons/spring.svg",
    label: "Spring",
    rotation: 84,
  },
  {
    className: "converging-orb-small",
    fromX: "-54vw",
    fromY: "-10vh",
    icon: "/icons/redis.svg",
    label: "Redis",
    rotation: -48,
  },
  {
    className: "converging-orb-large",
    fromX: "45vw",
    fromY: "34vh",
    icon: "/icons/mysql.svg",
    label: "MySQL",
    rotation: 66,
  },
  {
    className: "converging-orb-medium",
    fromX: "-40vmin",
    fromY: "-48vmin",
    icon: "/icons/kafka.svg",
    label: "Apache Kafka",
    rotation: -94,
  },
  {
    className: "converging-orb-small",
    fromX: "16vw",
    fromY: "-52vh",
    icon: "/icons/nextjs.svg",
    label: "Next.js",
    rotation: 58,
  },
  {
    className: "converging-orb-large",
    fromX: "-46vw",
    fromY: "36vh",
    icon: "/icons/docker.svg",
    label: "Docker",
    rotation: -108,
  },
  {
    className: "converging-orb-medium",
    fromX: "52vw",
    fromY: "-20vh",
    icon: "/icons/ddd.png",
    label: "Domain-Driven Design",
    rotation: 112,
  },
  {
    className: "converging-orb-large",
    fromX: "-22vw",
    fromY: "-60vh",
    icon: "/icons/go.svg",
    label: "Go",
    rotation: -62,
  },
] as const;

export default function OrbConvergence() {
  return (
    <div
      className="pointer-events-none relative h-[13rem] w-full -translate-y-6 sm:h-[15rem] sm:-translate-y-8"
      aria-hidden="true"
    >
      {approachPaths.map((path, index) => (
        <span
          className={`converging-orb ${path.className}`}
          data-converging-orb
          key={`${path.fromX}-${path.fromY}-${index}`}
        >
          <Image
            className={`converging-orb-icon ${
              path.label === "Domain-Driven Design" ? "scale-[1.8]" : ""
            }`}
            src={path.icon}
            alt={path.label}
            width={160}
            height={160}
          />
        </span>
      ))}

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        data-orb-target
      >
        <FlowingOrb />
      </div>
    </div>
  );
}
