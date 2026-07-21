export type Company = {
  name: string;
};

export type Profile = {
  name: string;
  roles: readonly string[];
  email: string;
  signals: readonly string[];
  summary: string;
  companies: readonly Company[];
};

export const profile = {
  name: "Harrison Wang",
  roles: ["Senior Software Engineer", "System Design", "Software Architect"],
  email: "hello@harrison.arch",
  signals: ["Software architect", "15+ years", "Open to connect"],
  summary:
    "I design resilient distributed systems and build clear, production-ready products with Next.js.",
  companies: [
    { name: "ByteDance" },
    { name: "Alibaba" },
    { name: "NetEase" },
    { name: "Yonyou" },
    { name: "NTT DATA" },
  ],
} as const satisfies Profile;
