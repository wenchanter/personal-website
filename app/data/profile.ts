export type Profile = {
  name: string;
  roles: readonly string[];
  email: string;
  signals: readonly string[];
  summary: string;
  skills: readonly string[];
};

export const profile = {
  name: "Harrison Wang",
  roles: ["Senior Software Engineer", "System Designer", "Software Architect"],
  email: "hello@harrison.arch",
  signals: ["Software architect", "15+ years", "Open to connect"],
  summary:
    "I design resilient distributed systems and build clear, production-ready products with Next.js.",
  skills: [
    "Python",
    "Spring Cloud",
    "Next.js",
    "React",
    "TypeScript",
    "Kubernetes",
    "Docker",
    "Redis",
    "Apache Kafka",
  ],
} as const satisfies Profile;
