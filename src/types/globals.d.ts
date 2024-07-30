export {};
export type Roles =
  | "admin"
  | "user"
  | "unathourized"
  | "org:page_owner"
  | "owner";
declare global {
  interface CustomJwtSessionClaims {
    membership: Record<string, string>;
    departament: Record<string, string>;
    role?: Roles;
  }
}
