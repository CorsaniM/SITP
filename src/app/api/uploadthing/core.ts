import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db, schema } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ input }) => {
      const session = getServerAuthSession();
      if (!session) throw new Error("No autorizado");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [response] = await db
        .insert(schema.images)
        .values({
          userName: metadata.userId,
          commentId: 0,
          url: file.url,
        })
        .returning();


      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
