import Image from "next/image";

import FlowingOrb from "@/app/components/home/FlowingOrb";
import { approachPaths } from "@/app/data/orbs";

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
