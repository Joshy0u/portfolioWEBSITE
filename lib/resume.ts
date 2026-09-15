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
  story: string[];
  repo: { label: string; url: string };
}[] = [
  {
    id: "data",
    index: "01",
    label: "Data Layer",
    kicker: "Databases",
    summary: "Where I keep the data honest.",
    tags: ["PostgreSQL", "Supabase", "Docker", "CI/CD", "Pydantic"],
    story: [
      "This is my home for anything data. I lean on managed Postgres through Supabase and model everything with typed schemas so services can't quietly corrupt each other.",
      "It's also where my CI/CD pipeline lives — a two-stage build that ships two Docker images from one repo, one for the frontend and one for the backend, so deploys stay clean and repeatable.",
    ],
    repo: {
      label: "Joshy0u/DATABASE_project",
      url: "https://github.com/Joshy0u/DATABASE_project",
    },
  },
  {
    id: "platform",
    index: "02",
    label: "Platform / DevOps",
    kicker: "Infra & K8s",
    summary: "The heavy one — I treat the cluster like a product.",
    tags: ["Kubernetes", "ArgoCD", "Terraform", "Helm", "Grafana", "Tailscale"],
    story: [
      "This is the big project. GitHub Actions builds the artifacts, ArgoCD keeps the cluster matching Git, and I roll updates out Blue-Green and Canary style so I can catch what breaks before anyone else does.",
      "Terraform and Helm codify a Grafana stack so I can actually feel what the infra is doing, and everything stays reachable over a private Tailscale mesh with Traefik out front.",
    ],
    repo: {
      label: "Joshy0u/k8s-infrastructure",
      url: "https://github.com/Joshy0u/k8s-infrastructure",
    },
  },
  {
    id: "ml",
    index: "03",
    label: "Machine Learning",
    kicker: "ML & Autonomy",
    summary: "My playground for autonomy.",
    tags: ["PyTorch", "ROS2", "Actor-Critic", "Deep RL"],
    story: [
      "I built out an F1Tenth lab and use it to experiment with actor-critic reinforcement learning — teaching a 1/10-scale car to find a fast racing line.",
      "Perception and control run as ROS2 nodes and the policy trains in PyTorch. It's messy and experimental, and honestly that's the fun part.",
    ],
    repo: {
      label: "Joshy0u/bug-filled-f1-octo-doodle",
      url: "https://github.com/Joshy0u/bug-filled-f1-octo-doodle",
    },
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
