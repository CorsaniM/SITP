export {};
export type Roles =
  | "org:admin"
  | "admin"
  | "org:member"
  | "member"
  | "unathourized"
  | "org:page_owner"
  | "page_owner";
declare global {
  interface CustomJwtSessionClaims {
    membership: Record<string, string>;
    departament: Record<string, string>;
    role?: Roles;
  }
}
