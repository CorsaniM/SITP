export {};
export type Roles = "Admin" | "Member" | "unathourized" | "Owner";
declare global {
  interface CustomJwtSessionClaims {
    membership: Record<string, string>;
    departament: Record<string, string>;
    role?: Roles;
  }
}
