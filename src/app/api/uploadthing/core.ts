import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerAuthSession } from "~/server/auth";
import { z } from "zod";
import { db, schema } from "~/server/db";
import { eq } from "drizzle-orm";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ ticketId: z.string() }))
    .middleware(async ({ input }) => {
      const session = await getServerAuthSession();

      if (!session) throw new UploadThingError("Unauthorized");
      if (!session) throw new UploadThingError("Unauthorized");

      return { userId: session.user.id, ticketId: input.ticketId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [respuesta] = await db
        .insert(schema.images)
        .values({
          userName: metadata.userId,
          ticketId: parseInt(metadata.ticketId),
          url: file.url,
        })
        .returning();

      await db
        .update(schema.comments)
        .set({
          ticketId: parseInt(metadata.ticketId),
        })
        .where(eq(schema.comments.ticketId, respuesta?.ticketId ?? 0));

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
