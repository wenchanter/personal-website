export type Profile = {
  name: string;
  roles: readonly string[];
  email: string;
  linkedin: string;
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
  logo: string;
  technologies: readonly string[];
  tone: "blue" | "orange" | "rose" | "red" | "sky";
};

export const profile = {
  name: "Harrison Wang",
  roles: ["Senior Software Engineer", "System Designer", "Software Architect"],
  email: "hello@harrison.arch",
  linkedin: "https://www.linkedin.com/in/harrison-wang-7445299a/",
  signals: ["Senior Software Engineer", "Software architect", "15+ years"],
  summary:
    "Designed and delivered scalable and resilient systems, re-architected complex settlement systems using DDD, and implemented a distributed fair queue for multi-tenant traffic isolation.",
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
      role: "Senior Software Engineer",
      summary:
        "Resolved several complex technical challenges, including designing a distributed fair queue to isolate multi-tenant traffic. The solution supported hundreds of millions of workflow instances through sharding. Additionally, built an automated deployment platform for the Lark on-premises environment, cutting deployment time from 20 days to 5 days.",
      logo: "/logos/bytedance.svg",
      technologies: [
        "Golang",
        "Kafka",
        "Thrift",
        "Redis",
        "MySQL",
        "ByteDance Cloud",
      ],
      tone: "blue",
    },
    {
      id: "alibaba",
      company: "Alibaba",
      companyLocal: "阿里巴巴",
      period: "2018 — 2021",
      endYear: "2021",
      role: "Senior Software Engineer",
      summary:
        "Led the re-architecture of a CPS settlement platform processing over 900 million orders and more than CNY 3 billion in monthly settlements using Domain-Driven Design (DDD). Delivered the re-architecture within six months with zero financial loss and zero production incidents, significantly improving the platform's extensibility. Built scalable settlement systems for multiple advertising products across Alibaba Group.",
      logo: "/logos/alibaba.svg",
      technologies: [
        "Java",
        "DDD",
        "Spring",
        "MySQL",
        "RocketMQ",
        "Alibaba Cloud",
      ],
      tone: "orange",
    },
    {
      id: "netease",
      company: "NetEase",
      companyLocal: "网易",
      period: "2011 — 2018",
      endYear: "2018",
      role: "Senior Software Engineer",
      summary:
        "Designed and built a CMS and high-throughput backend services for the NetEase website and NetEase News app, serving approximately 15 million daily active users and handling peak traffic of 400k requests per second, while maintaining 99.95% system availability. Additionally, developed an in-app marketplace, coupon system, and campaign management platform to drive user engagement and retention.",
      logo: "/logos/netease.svg",
      technologies: ["Java", "Spring Boot", "Redis", "Kafka", "MySQL", "Nginx"],
      tone: "rose",
    },
    {
      id: "yonyou",
      company: "Yonyou",
      companyLocal: "用友",
      period: "2010 — 2011",
      endYear: "2011",
      role: "Software Engineer",
      summary:
        "Designed and developed procurement and quality inspection modules for the NC 6.0 ERP supply chain platform, supporting core supply chain operations.",
      logo: "/logos/yonyou.png",
      technologies: ["Java", "Spring", "Oracle", "MyBatis", "ERP"],
      tone: "red",
    },
    {
      id: "ntt-data",
      company: "NTT DATA",
      companyLocal: "",
      period: "2007 — 2010",
      endYear: "2010",
      role: "Software Engineer",
      summary:
        "Developed payment integration services connecting China UnionPay with Japanese credit card networks for cross-border transactions.",
      logo: "/logos/ntt-data.svg",
      technologies: ["Java", "Oracle", "Spring", "JSP", "HTML"],
      tone: "sky",
    },
  ],
} as const satisfies Profile;
