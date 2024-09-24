// import { createNextPageApiHandler } from "uploadthing/next";
// import { ourFileRouter } from "~/server/uploadthing";

// // Crea el handler que conecte con UploadThing
// const handler = createNextPageApiHandler({
//   router: ourFileRouter,
// });

// export default handler;

// src/pages/api/uploadthing.ts
// import { ourFileRouter } from "~/server/uploadthing";
import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
