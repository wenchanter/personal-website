export type Profile = {
  name: string;
  roles: readonly string[];
  email: string;
  signals: readonly string[];
  summary: string;
  skills: readonly string[];
  workHistory: readonly WorkHistoryItem[];
};

export type WorkHistoryItem = {
  id: string;
  company: string;
  companyLocal?: string;
  period: string;
  endYear: string;
  role: string;
  summary: string;
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
  workHistory: [
    {
      id: "bytedance",
      company: "ByteDance",
      companyLocal: "字节跳动",
      period: "2021 — 2024",
      endYear: "2024",
      role: "Senior Software Architect",
      summary:
        "Led architecture design for core business systems. Drove microservice transformation for high-concurrency traffic and established cross-team engineering standards.",
    },
    {
      id: "alibaba",
      company: "Alibaba",
      companyLocal: "阿里巴巴",
      period: "2018 — 2021",
      endYear: "2021",
      role: "Staff Software Engineer",
      summary:
        "Designed distributed commerce services, improved platform reliability, and helped engineering teams turn complex domain requirements into maintainable systems.",
    },
    {
      id: "netease",
      company: "NetEase",
      companyLocal: "网易",
      period: "2015 — 2018",
      endYear: "2018",
      role: "Senior Software Engineer",
      summary:
        "Built scalable backend platforms and data-intensive services, with a focus on performance, service boundaries, and production observability.",
    },
    {
      id: "yonyou",
      company: "Yonyou",
      companyLocal: "用友",
      period: "2012 — 2015",
      endYear: "2015",
      role: "Software Engineer",
      summary:
        "Developed enterprise software modules and integrations, translating operational workflows into dependable Java services and reusable platform capabilities.",
    },
    {
      id: "ntt-data",
      company: "NTT DATA",
      companyLocal: "",
      period: "2009 — 2012",
      endYear: "2012",
      role: "Java Engineer",
      summary:
        "Started building production Java applications for large organisations, developing a durable foundation in testing, delivery, and systems thinking.",
    },
  ],
} as const satisfies Profile;
