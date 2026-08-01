export type BlogPostSummary = {
  slug: string;
  category: string;
  eyebrow: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
  tags: readonly string[];
  featured?: boolean;
};

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "heading"; id: string; text: string; level?: 2 | 3 }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: readonly string[]; ordered?: boolean }
  | { type: "quote"; text: string; cite?: string }
  | { type: "code"; language: string; code: string };

export type BlogPost = BlogPostSummary & {
  content: readonly ArticleBlock[];
};

export const blogAuthor = {
  name: "Harrison Wang",
  initial: "H",
  role: "Senior Software Engineer | Architect",
} as const;

export const blogFilters = [
  "All",
  "Architecture",
  "DDD",
  "Go · Java",
  "Next.js",
  "Microservices",
  "High Availability",
] as const;

export const blogPosts: readonly BlogPost[] = [
  {
    slug: "architecture-evolution-bytedance-alibaba",
    category: "Architecture",
    eyebrow: "从字节到阿里：架构演进的思考",
    title: "Architecture Evolution: Lessons from ByteDance to Alibaba",
    description:
      "Two top-tier internet companies, two radically different engineering cultures. What I learned about system design from working at both ends of the product spectrum — and why context is always the most important variable.",
    publishedAt: "Nov 15, 2024",
    readingTime: "12 min read",
    tags: ["Architecture", "Microservices"],
    featured: true,
    content: [
      {
        type: "lead",
        text: "The same architecture diagram can be brilliant in one company and disastrous in another. After years of building systems in two very different engineering cultures, I have stopped asking whether a design is good and started asking what it optimises for.",
      },
      {
        type: "heading",
        id: "two-cultures",
        text: "Two cultures, two definitions of correct",
      },
      {
        type: "paragraph",
        text: "One organisation optimised for iteration speed: ship, measure, discard. Services were cheap to create and cheap to delete, and nobody mourned a module that lived for six weeks. The other optimised for durability: money moved through the system, and a mistake was measured in reconciliation reports rather than dashboards.",
      },
      {
        type: "paragraph",
        text: "Neither culture was careless. They simply priced risk differently, and the architecture followed the price. Once I saw that, the endless microservices-versus-monolith debate stopped being interesting — the real question is which mistakes your organisation can afford to make.",
      },
      {
        type: "quote",
        text: "Architecture is the set of decisions you expect to be expensive to reverse. Everything else is just code.",
      },
      {
        type: "heading",
        id: "context-variable",
        text: "Context is the most important variable",
      },
      {
        type: "paragraph",
        text: "When I review a design now, I try to establish the context before the boxes and arrows. Four questions do most of the work:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "What is the cost of being wrong for an hour — a lost impression, or a wrong ledger entry?",
          "How many teams have to agree before this can change?",
          "What is the expected lifetime of this component: a quarter, or a decade?",
          "Who carries the pager, and do they have the authority to fix what wakes them up?",
        ],
      },
      {
        type: "paragraph",
        text: "A design that answers those four questions honestly is usually simpler than the one drawn from best practices alone, because it stops paying for flexibility nobody asked for.",
      },
      {
        type: "heading",
        id: "seams",
        text: "Split along seams, not along nouns",
      },
      {
        type: "paragraph",
        text: "The most common failure I have seen is decomposition by entity. Order service, user service, product service — clean on a slide, painful in production, because a single business operation still needs three synchronous hops and a distributed transaction to complete.",
      },
      {
        type: "paragraph",
        text: "Splitting along change seams works better. If two capabilities always deploy together, they belong together, whatever the domain glossary says.",
      },
      {
        type: "heading",
        id: "boundaries-in-code",
        text: "What the seam looks like in code",
        level: 3,
      },
      {
        type: "code",
        language: "go",
        code: `// A boundary worth keeping: the caller states intent,
// the domain decides what that intent means.
type SettlementService interface {
    Settle(ctx context.Context, cmd SettleCommand) (SettlementID, error)
}

// A boundary worth deleting: the caller orchestrates
// three round trips to express one business action.
type LeakyService interface {
    LockBalance(ctx context.Context, acct AccountID, amt Money) error
    WriteEntry(ctx context.Context, e Entry) error
    ReleaseLock(ctx context.Context, acct AccountID) error
}`,
      },
      {
        type: "heading",
        id: "carry-over",
        text: "What carried over",
      },
      {
        type: "paragraph",
        text: "Three habits survived both environments. Make state transitions explicit and idempotent, because retries are the only reliable failure handling at scale. Keep the write path narrow, because every additional writer is a future consistency bug. And instrument the business outcome, not just the HTTP status — a 200 that settles the wrong amount is worse than a 500.",
      },
      {
        type: "paragraph",
        text: "Everything else — the frameworks, the deployment topology, the org chart on the wiki — turned out to be local detail. Useful local detail, but not the thing worth carrying to the next system.",
      },
    ],
  },
  {
    slug: "ddd-refactoring-a-ten-year-old-monolith",
    category: "DDD",
    eyebrow: "DDD实战：重构十年单体应用",
    title: "DDD in Practice: Refactoring a 10-Year-Old Monolith",
    description:
      "Domain-Driven Design is not a silver bullet. Applied with discipline, it reveals the natural seams in a system and creates room for teams to evolve independently.",
    publishedAt: "Oct 22, 2024",
    readingTime: "18 min read",
    tags: ["DDD", "Architecture"],
    content: [
      {
        type: "lead",
        text: "A ten-year-old monolith is not a design failure. It is a decade of business decisions compressed into code, and most of them were correct at the time. The job of a refactor is to recover that intent, not to delete it.",
      },
      {
        type: "heading",
        id: "start-with-language",
        text: "Start with language, not with modules",
      },
      {
        type: "paragraph",
        text: "Our first attempt drew module boundaries from the package structure. It failed within a sprint, because the packages recorded how the code had grown rather than what the business did. The second attempt began with a glossary built from the words people actually used in operations meetings.",
      },
      {
        type: "paragraph",
        text: "The moment two teams used the same word for different things — settlement, in our case — we had found a context boundary worth drawing.",
      },
      {
        type: "quote",
        text: "When one word needs a qualifier to be unambiguous, you have discovered a bounded context.",
      },
      {
        type: "heading",
        id: "aggregates",
        text: "Aggregates earn their invariants",
      },
      {
        type: "paragraph",
        text: "An aggregate is not a folder for related data; it is the smallest unit that must stay consistent within one transaction. Every field we pulled into an aggregate had to justify itself against a rule that would break if it lived elsewhere.",
      },
      {
        type: "list",
        items: [
          "If two fields never change in the same transaction, they belong to different aggregates.",
          "If a rule spans aggregates, it is a domain service or an eventual-consistency policy — not an excuse for a bigger aggregate.",
          "Reference other aggregates by identity, never by object graph.",
        ],
      },
      {
        type: "code",
        language: "java",
        code: `public final class Settlement {
    private final SettlementId id;
    private SettlementStatus status;
    private final List<Entry> entries;

    // The invariant lives with the data it protects.
    public void confirm(Clock clock) {
        if (status != SettlementStatus.PENDING) {
            throw new IllegalStateTransition(id, status);
        }
        if (balance().isNotZero()) {
            throw new UnbalancedSettlement(id, balance());
        }
        this.status = SettlementStatus.CONFIRMED;
        register(new SettlementConfirmed(id, clock.instant()));
    }
}`,
      },
      {
        type: "heading",
        id: "strangler",
        text: "Strangle, never rewrite",
      },
      {
        type: "paragraph",
        text: "We never had a big-bang cutover. Each extracted context ran behind a facade in the monolith, with traffic shifted a percentage at a time and both implementations compared in the shadow path for a full billing cycle.",
      },
      {
        type: "paragraph",
        text: "The comparison harness caught more genuine bugs than any test suite we wrote, mostly around rounding rules that had never been documented anywhere except in the original code.",
      },
      {
        type: "heading",
        id: "what-it-bought",
        text: "What the refactor actually bought",
      },
      {
        type: "paragraph",
        text: "Not performance — that was roughly unchanged. What changed was the cost of a business request: a new fee rule went from a three-team coordination exercise to a single-team change with its own release cadence. That is the return DDD pays, and it only shows up in the calendar, never in the flame graph.",
      },
    ],
  },
  {
    slug: "go-concurrency-vs-java-threads",
    category: "Go · Java",
    eyebrow: "Go并发与Java线程：务实对比",
    title: "Go Concurrency vs Java Threads: A Pragmatic Comparison",
    description:
      "Goroutines changed how I think about concurrency. An honest comparison from someone who spent years building high-throughput systems in both ecosystems.",
    publishedAt: "Sep 10, 2024",
    readingTime: "15 min read",
    tags: ["Go · Java", "High Availability"],
    content: [
      {
        type: "lead",
        text: "Cheap concurrency does not remove concurrency problems. It relocates them — from thread pool tuning to lifecycle management, from contention to cancellation.",
      },
      {
        type: "heading",
        id: "cost-model",
        text: "The cost model is the real difference",
      },
      {
        type: "paragraph",
        text: "A goroutine starts at a couple of kilobytes and grows on demand, so blocking one is unremarkable. A platform thread is expensive enough that an entire generation of Java architecture — pools, async pipelines, reactive chains — exists to avoid blocking it. Virtual threads narrow that gap considerably, but the surrounding ecosystem still assumes the old cost model.",
      },
      {
        type: "list",
        items: [
          "Go pushes you toward blocking code that reads sequentially.",
          "Classic Java pushes you toward callbacks and reactive operators to protect a scarce resource.",
          "Virtual threads let Java write sequential code again — provided the libraries below it do not pin the carrier thread.",
        ],
      },
      {
        type: "heading",
        id: "cancellation",
        text: "Cancellation is where teams get hurt",
      },
      {
        type: "paragraph",
        text: "Spawning work is easy in both languages. Stopping it is not. In Go, a goroutine that ignores its context leaks silently, and the only symptom is a slowly rising memory graph at 3am.",
      },
      {
        type: "code",
        language: "go",
        code: `func fanOut(ctx context.Context, ids []string) error {
    g, ctx := errgroup.WithContext(ctx)
    g.SetLimit(16) // bound the work, always

    for _, id := range ids {
        g.Go(func() error {
            // ctx cancels every sibling on the first failure
            return process(ctx, id)
        })
    }
    return g.Wait()
}`,
      },
      {
        type: "paragraph",
        text: "Java's structured concurrency arrives at the same idea from the other direction: a scope owns its children, and leaving the scope means the children are finished. Whichever language you use, the rule is the same — no unbounded, unowned concurrency.",
      },
      {
        type: "quote",
        text: "Unbounded parallelism is not a performance feature. It is a deferred outage.",
      },
      {
        type: "heading",
        id: "picking",
        text: "How I choose now",
      },
      {
        type: "paragraph",
        text: "For network-bound services with a small domain and a high connection count, Go's simplicity wins. For systems with deep business rules, long-lived data models, and heavy tooling requirements, the JVM ecosystem still pays for itself. The choice is rarely about the concurrency primitive — it is about which mistakes the surrounding ecosystem prevents.",
      },
    ],
  },
  {
    slug: "distributed-fair-queue",
    category: "High Availability",
    eyebrow: "多租户流量隔离中的公平队列",
    title: "Designing a Distributed Fair Queue at Scale",
    description:
      "How to protect every tenant from noisy neighbours while keeping throughput predictable across hundreds of millions of workflow instances.",
    publishedAt: "Aug 28, 2024",
    readingTime: "16 min read",
    tags: ["High Availability", "Architecture"],
    content: [
      {
        type: "lead",
        text: "One tenant submitting a million tasks should not slow down the tenant submitting ten. That sentence looks obvious on a whiteboard and takes a surprising amount of engineering to make true.",
      },
      {
        type: "heading",
        id: "failure-mode",
        text: "The failure mode we were solving",
      },
      {
        type: "paragraph",
        text: "A single FIFO queue gives you head-of-line blocking with extra steps. Once a bulk import lands, every other tenant waits behind it, and latency percentiles stop describing anything real because the queue position — not the service — decides the outcome.",
      },
      {
        type: "heading",
        id: "design",
        text: "Per-tenant queues, weighted dispatch",
      },
      {
        type: "paragraph",
        text: "The design that held up was a virtual queue per tenant plus a dispatcher that selects the next tenant by deficit round robin. Each tenant accumulates a quantum of credit per round and can only dequeue while it has credit left.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Shard tenants across dispatcher nodes by consistent hash so a tenant's ordering guarantees stay on one owner.",
          "Give each tenant a quantum proportional to its plan, not to its backlog.",
          "Cap in-flight work per tenant so a slow downstream cannot consume the whole worker pool.",
          "Age the credit of idle tenants so bursty small tenants are not starved by steady large ones.",
        ],
      },
      {
        type: "code",
        language: "go",
        code: `// Deficit round robin: credit decides the turn, backlog never does.
func (d *Dispatcher) next() (*Task, bool) {
    for range d.tenants {
        t := d.ring.advance()
        t.credit += t.quantum

        if head := t.peek(); head != nil && head.cost <= t.credit {
            t.credit -= head.cost
            return t.pop(), true
        }
    }
    return nil, false
}`,
      },
      {
        type: "quote",
        text: "Fairness is not equal throughput. It is throughput that no single tenant can take from another.",
      },
      {
        type: "heading",
        id: "operating",
        text: "Operating it",
      },
      {
        type: "paragraph",
        text: "Two signals mattered more than the rest: per-tenant wait time at the 99th percentile, and the ratio of granted to requested credit. The first tells you whether the promise still holds; the second tells you when the cluster is genuinely undersized rather than merely unfair.",
      },
      {
        type: "paragraph",
        text: "Rebalancing was the hardest operational problem. Moving a tenant between owners means draining in-flight work first, so we made ownership handover an explicit, observable state machine rather than a side effect of a rebalance event.",
      },
    ],
  },
  {
    slug: "microservices-boundaries-that-last",
    category: "Microservices",
    eyebrow: "经得住变化的服务边界",
    title: "Microservice Boundaries That Survive Organisational Change",
    description:
      "Service boundaries are team boundaries in disguise. A practical way to align domains, ownership, and operational responsibility before splitting a monolith.",
    publishedAt: "Jul 19, 2024",
    readingTime: "14 min read",
    tags: ["Microservices", "DDD"],
    content: [
      {
        type: "lead",
        text: "Most broken microservice architectures were not designed badly. They were designed for an org chart that has since been reorganised twice.",
      },
      {
        type: "heading",
        id: "ownership",
        text: "A boundary without an owner is a liability",
      },
      {
        type: "paragraph",
        text: "Before drawing a single line, I now ask who will own each side of it a year from now. If the answer is the same team, the line is internal and should stay a module. If nobody can name an owner, the service will become shared infrastructure that everyone changes and no one maintains.",
      },
      {
        type: "quote",
        text: "Every service boundary is a permanent negotiation cost. Only pay it where you want a negotiation.",
      },
      {
        type: "heading",
        id: "contract",
        text: "Design the contract before the split",
      },
      {
        type: "paragraph",
        text: "The useful test is whether the interface still makes sense if the implementation is replaced entirely. Contracts that expose intent survive; contracts that expose the current data model turn into a distributed version of the same coupling you started with.",
      },
      {
        type: "list",
        items: [
          "Expose commands and events, not tables.",
          "Version by adding, never by mutating a field's meaning.",
          "Make failure part of the contract: timeouts, retries, and idempotency keys are API surface.",
        ],
      },
      {
        type: "heading",
        id: "reversibility",
        text: "Keep the split reversible for one release",
      },
      {
        type: "paragraph",
        text: "We ran every extraction behind a flag with the old path intact for a full release cycle. It cost some duplicated code and saved us twice — once for a boundary that turned out to be one aggregate too small, and once for a data migration that needed a second attempt.",
      },
      {
        type: "paragraph",
        text: "Reversibility is the cheapest insurance in distributed systems, and it expires quickly. If you have not exercised the rollback path within a release, assume it no longer works.",
      },
    ],
  },
  {
    slug: "nextjs-for-backend-engineers",
    category: "Next.js",
    eyebrow: "后端工程师眼中的Next.js",
    title: "Next.js Through a Backend Engineer’s Eyes",
    description:
      "Rendering modes, cache boundaries, and deployment trade-offs explained with the mental models backend engineers already use every day.",
    publishedAt: "Jun 05, 2024",
    readingTime: "11 min read",
    tags: ["Next.js", "Architecture"],
    content: [
      {
        type: "lead",
        text: "Coming from backend systems, the App Router finally clicked when I stopped reading it as a frontend framework and started reading it as a cache hierarchy with a rendering step attached.",
      },
      {
        type: "heading",
        id: "rendering-modes",
        text: "Rendering modes are just cache policies",
      },
      {
        type: "paragraph",
        text: "Static generation is a build-time cache with an infinite TTL. Incremental regeneration is the same cache with a TTL and a background refresh. Dynamic rendering is a cache miss on every request. Once framed that way, the decision is the familiar one: how stale may this data be, and who pays for the miss?",
      },
      {
        type: "list",
        items: [
          "Content that changes on deploy — prerender it and stop thinking about it.",
          "Content that changes on a schedule — revalidate on a timer and accept bounded staleness.",
          "Content that is per-request — render dynamically and budget for the latency.",
        ],
      },
      {
        type: "heading",
        id: "boundaries",
        text: "Server and client are a trust boundary",
      },
      {
        type: "paragraph",
        text: "The server/client component split is the same boundary backend engineers already respect between a service and its callers. Anything that touches a secret, a database, or an internal service stays on the server side of the line; the client receives data, not capability.",
      },
      {
        type: "code",
        language: "tsx",
        code: `// Server component: runs at build time for a static export.
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const post = getPost(slug)

  return <Article post={post} />
}`,
      },
      {
        type: "heading",
        id: "deployment",
        text: "Deployment shapes the design",
      },
      {
        type: "paragraph",
        text: "This site is a static export served from a CDN, which is a deliberate constraint: no request-time server, no runtime secrets, nothing to page anyone at 3am. Every dynamic feature has to justify itself against that baseline — and most of them, it turns out, cannot.",
      },
      {
        type: "quote",
        text: "The cheapest system to operate is the one that finished all its work before the first user arrived.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getHeadings(content: readonly ArticleBlock[]) {
  return content.flatMap((block) =>
    block.type === "heading"
      ? [{ id: block.id, text: block.text, level: block.level ?? 2 }]
      : [],
  );
}

// Prefer posts that share the most tags, then fall back to publication order.
export function getRelatedPosts(slug: string, limit = 3): BlogPostSummary[] {
  const post = getPostBySlug(slug);

  if (!post) {
    return [];
  }

  return blogPosts
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => ({
      candidate,
      shared: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getAdjacentPosts(slug: string): {
  previous: BlogPostSummary | null;
  next: BlogPostSummary | null;
} {
  const index = blogPosts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: blogPosts[index - 1] ?? null,
    next: blogPosts[index + 1] ?? null,
  };
}
