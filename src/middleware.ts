import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/(.*)", "/forum(.*)"]);
const isWebhookRoute = createRouteMatcher(["/api/uploadthing(.*)"]);
const isWebhookRouteApi = createRouteMatcher(["/api/hono(.*)"]);

// Nueva condición para rutas permitidas
const isPublicApiRoute = createRouteMatcher(["/api/tickets"]);

export default clerkMiddleware((auth, req) => {
  // Permitir acceso a la ruta del webhook
  if (isWebhookRoute(req) || isWebhookRouteApi(req)) {
    return; // No hacer nada, deja que pase sin protección
  }

  // Permitir acceso a las rutas públicas
  if (isPublicApiRoute(req)) {
    return; // No hacer nada, deja que pase sin protección
  }

  // Proteger otras rutas
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
