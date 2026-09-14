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
