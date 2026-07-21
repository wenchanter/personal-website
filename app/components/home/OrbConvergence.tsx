import FlowingOrb from "@/app/components/home/FlowingOrb";

export const approachPaths = [
  {
    className: "converging-orb-large",
    fromX: "-38vw",
    fromY: "-46vh",
    rotation: -72,
  },
  {
    className: "converging-orb-medium",
    fromX: "37vw",
    fromY: "-40vh",
    rotation: 84,
  },
  {
    className: "converging-orb-small",
    fromX: "-40vw",
    fromY: "-14vh",
    rotation: -48,
  },
  {
    className: "converging-orb-large",
    fromX: "39vw",
    fromY: "-4vh",
    rotation: 66,
  },
  {
    className: "converging-orb-medium",
    fromX: "-30vw",
    fromY: "20vh",
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
        />
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
