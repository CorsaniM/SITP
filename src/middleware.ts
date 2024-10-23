import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/(.*)", "/forum(.*)"]);
const isWebhookRoute = createRouteMatcher(["/api/uploadthing(.*)"]);
const isWebhookRouteApi = createRouteMatcher(["/api/hono(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Permitir acceso a la ruta del webhook
  if (isWebhookRoute(req)) {
    return; // No hacer nada, deja que pase sin protección
  }
  if (isWebhookRouteApi(req)) {
    return;
  }
  // Proteger otras rutas
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
