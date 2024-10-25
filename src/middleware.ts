import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas protegidas
const isProtectedRoute = createRouteMatcher(["/(.*)", "/forum(.*)"]);

// Rutas de webhook
const isWebhookRoute = createRouteMatcher(["/api/uploadthing(.*)"]);
const isWebhookRouteApi = createRouteMatcher(["/api/hono(.*)"]);

const isPublicApiRoute = createRouteMatcher(["/api/hono/tickets"]);

export default clerkMiddleware((auth, req) => {
  if (isWebhookRoute(req) || isWebhookRouteApi(req)) {
    return; // Permitir acceso sin protección
  }

  // Permitir acceso a las rutas públicas
  if (isPublicApiRoute(req)) {
    return; // Permitir acceso sin protección
  }

  // Proteger otras rutas
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

// Configuración del matcher
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
