export type UserRole = 
  | "Software Engineer"
  | "Blockchain Engineer"
  | "Product Manager"
  | "Marketing"
  | "Operations / DevOps";

export interface RoleConfig {
  id: string;
  title: UserRole;
  icon: string;
  description: string;
  color: string;
  recommendedTools: string[];
}
