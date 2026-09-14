export type CubeFace =
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "fidget"
  | "contact";

export const resume = {
  name: "Joshua John",
  headline: "Systems Engineering M.S. & Computer Science B.S. @ UT Dallas",
  role: "DevOps, ML, & Cloud Infrastructure Engineer",
  about: [
    "Systems-minded engineer who likes infrastructure you can feel: pipelines, clusters, observability, and the occasional racing stack.",
    "Currently focused on DevOps, machine learning, and cloud infrastructure — grayscale, high-contrast, no fluff.",
  ],
  skillGroups: [
    {
      title: "Languages",
      items: ["Go", "Python", "Java", "C++", "C", "Bash"],
    },
    {
      title: "Cloud & Infra",
      items: ["AWS", "GCP", "Azure", "Terraform", "Docker", "Kubernetes"],
    },
    {
      title: "Observability & CI/CD",
      items: ["GitHub Actions", "ArgoCD", "Prometheus", "Grafana", "Datadog"],
    },
    {
      title: "Databases & Netting",
      items: ["PostgreSQL", "Supabase", "Tailscale", "Traefik", "MongoDB"],
    },
  ],
  featuredBadges: [
    "Docker",
    "Kubernetes",
    "Go",
    "Python",
    "AWS",
    "ROS2",
    "PyTorch",
    "Terraform",
    "ArgoCD",
  ],
  projects: [
    {
      title: "Restaurant Management System",
      blurb:
        "Service mesh of menus, orders, and auth sitting behind a reverse proxy — typed models, managed Postgres, cluster-native deploy.",
      stack: ["Traefik Proxy", "Supabase", "PostgreSQL", "Kubernetes", "Pydantic"],
    },
    {
      title: "GitOps CI/CD Pipeline",
      blurb:
        "Decoupled delivery: app repos emit artifacts, cluster state lives in Git, promotions are declarative instead of SSH folklore.",
      stack: ["ArgoCD", "Blue-Green", "Canary", "GitHub Actions"],
    },
    {
      title: "F1Tenth Autonomous Racing",
      blurb:
        "1/10-scale autonomous racecar. Perception and control in ROS2, policy trained with deep reinforcement learning in PyTorch.",
      stack: ["ROS2", "PyTorch", "Deep RL"],
    },
  ],
  experience: [
    {
      org: "UTD Formula SAE",
      title: "Software Project Manager",
      blurb:
        "Led the software program through an Azure → AWS migration: environments, identity, and the boring reliability work that keeps a student racing org shipping.",
    },
    {
      org: "ACM UTD",
      title: "Technical Mentor",
      blurb:
        "Mentored members on systems, cloud, and software craft — code review, architecture, and getting unstuck without cargo-culting docs.",
    },
  ],
  contact: {
    github: "https://github.com/your-handle",
    linkedin: "https://linkedin.com/in/your-handle",
    email: "you@example.com",
  },
} as const;

export type DomainId = "data" | "platform" | "ml";

// Each bottom "node" maps to one domain. Clicking a node populates the
// top-right card with that domain's details, sourced from the resumes.
export const domains: {
  id: DomainId;
  index: string;
  label: string;
  kicker: string;
  summary: string;
  tags: string[];
  highlights: string[];
}[] = [
  {
    id: "data",
    index: "01",
    label: "Data Layer",
    kicker: "Databases",
    summary:
      "Schema design, managed Postgres, and data integrity across microservices.",
    tags: ["PostgreSQL", "Supabase", "MongoDB", "Redis", "MySQL", "Pydantic"],
    highlights: [
      "Modeled and validated schemas with Pydantic to keep data integrity across microservices.",
      "Built automated ingestion pipelines and REST APIs in Python, tuning queries for throughput.",
      "Ran managed Postgres on Supabase behind a cluster-native restaurant management system.",
    ],
  },
  {
    id: "platform",
    index: "02",
    label: "Platform / DevOps",
    kicker: "Infra & K8s",
    summary:
      "GitOps delivery, Kubernetes operations, and observability you can feel.",
    tags: [
      "Kubernetes",
      "ArgoCD",
      "Terraform",
      "Helm",
      "Docker",
      "Grafana",
      "Traefik",
      "Tailscale",
    ],
    highlights: [
      "Architected a decoupled GitOps CI/CD pipeline with GitHub Actions and ArgoCD reconciliation loops.",
      "Ran Blue-Green and Canary rollouts as live stress tests of update and traffic scenarios.",
      "Codified a Grafana monitoring stack with Terraform + Helm, PVCs on Longhorn backed to S3.",
      "Exposed cluster master nodes securely over a Tailscale mesh with Traefik ingress.",
    ],
  },
  {
    id: "ml",
    index: "03",
    label: "Machine Learning",
    kicker: "ML & Autonomy",
    summary:
      "Deep reinforcement learning and perception on a 1/10-scale autonomous racecar.",
    tags: ["PyTorch", "ROS2", "Deep RL", "Python"],
    highlights: [
      "Trained an actor-critic deep RL policy to optimize racing lines on F1Tenth.",
      "Deployed wall-following and pursuit controllers as ROS2 nodes in Python.",
    ],
  },
];

export const cubeFaces: {
  id: CubeFace;
  label: string;
  kicker: string;
}[] = [
  { id: "about", label: "ABOUT", kicker: "Bio" },
  { id: "skills", label: "SKILLS", kicker: "Stack" },
  { id: "projects", label: "SYSTEMS", kicker: "Projects" },
  { id: "experience", label: "XP", kicker: "Leadership" },
  { id: "fidget", label: "CLICK", kicker: "Fidget" },
  { id: "contact", label: "PING", kicker: "Contact" },
];
