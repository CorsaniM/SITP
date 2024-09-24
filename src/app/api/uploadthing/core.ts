import { createUploadthing, type FileRouter } from "uploadthing/next";
import { db, schema } from "~/server/db"; // Importa correctamente tu configuración de la base de datos
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getServerAuthSession } from "~/server/auth";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .input(z.object({ commentId: z.number() })) // Asegúrate de que el `ticketId` sea un string
    .middleware(async ({ input }) => {
      const session = await getServerAuthSession();
      if (!session) throw new Error("No autorizado");

      return { userId: session.user.id, commentId: input.commentId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const [response] = await db
        .insert(schema.images)
        .values({
          userName: metadata.userId,
          commentId: metadata.commentId,
          url: file.url,
        })
        .returning();

      console.log("Imagen subida correctamente:", response);

      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
