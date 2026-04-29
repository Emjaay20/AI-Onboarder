import { RoleConfig } from "@/types";

export type { RoleConfig };
export const roles: RoleConfig[] = [
  {
    id: "software-engineer",
    title: "Software Engineer",
    icon: "💻",
    description: "Building applications and backend systems",
    color: "cyan",
    recommendedTools: ["Cursor", "Claude Code", "LangGraph"],
  },
  {
    id: "blockchain-engineer",
    title: "Blockchain Engineer",
    icon: "🔗",
    description: "Working with Polygon, smart contracts & on-chain tools",
    color: "purple",
    recommendedTools: ["Polygon Agent CLI", "Cursor", "Foundry", "LangGraph"],
  },
  {
    id: "product-manager",
    title: "Product Manager",
    icon: "📋",
    description: "Defining features and roadmaps",
    color: "emerald",
    recommendedTools: ["Claude", "Cursor", "Linear Assistant"],
  },
  {
    id: "marketing",
    title: "Marketing",
    icon: "📣",
    description: "Content, campaigns & growth",
    color: "pink",
    recommendedTools: ["Claude", "Cursor"],
  },
  {
    id: "operations",
    title: "Operations / DevOps",
    icon: "⚙️",
    description: "Infrastructure, monitoring & automation",
    color: "amber",
    recommendedTools: ["Cursor", "LangGraph Agents"],
  },
];
