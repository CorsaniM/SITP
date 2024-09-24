import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { db, schema } from "~/server/db";

const f = createUploadthing();

const auth = (_req: Request) => ({ id: "fakeId" }); // Fake auth function
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const session = getServerAuthSession();

      if (!session) throw new UploadThingError("Unauthorized");

      return { userName: session.user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db.insert(schema.images).values({
        userName: metadata.userName,
        ticketId: 0,
        url: file.url
      })

      return { uploadedBy: metadata.userName };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
