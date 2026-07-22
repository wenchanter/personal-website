import Image from "next/image";

import FlowingOrb from "@/app/components/home/FlowingOrb";

export const approachPaths = [
  {
    className: "converging-orb-large",
    fromX: "-38vw",
    fromY: "-46vh",
    icon: "/icons/java.svg",
    label: "Java",
    rotation: -72,
  },
  {
    className: "converging-orb-medium",
    fromX: "37vw",
    fromY: "-40vh",
    icon: "/icons/spring.svg",
    label: "Spring",
    rotation: 84,
  },
  {
    className: "converging-orb-small",
    fromX: "-40vw",
    fromY: "-14vh",
    icon: "/icons/redis.svg",
    label: "Redis",
    rotation: -48,
  },
  {
    className: "converging-orb-large",
    fromX: "39vw",
    fromY: "-4vh",
    icon: "/icons/mysql.svg",
    label: "MySQL",
    rotation: 66,
  },
  {
    className: "converging-orb-medium",
    fromX: "-30vw",
    fromY: "20vh",
    icon: "/icons/kafka.svg",
    label: "Apache Kafka",
    rotation: -94,
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
            className="converging-orb-icon"
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
