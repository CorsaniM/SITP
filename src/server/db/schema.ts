// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, integer, sqliteTable, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { number } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `stip_${name}`);

export const tickets = createTable(
  "tickets",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    orgId: text("orgId", { length: 256 }),
    state: text("state", { length: 256 }),
    urgency: int("urgency"),
    suppUrgency: int("suppUrgency"),
    title: text("title", { length: 256 }),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  })
);

export const ticketsRelations = relations(tickets, ({many}) => ({
  comments: many(comments),
  images: many(images),
  events: many(events),
  participants: many(participants),
}));

export const comments = createTable(
  "comments",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId").notNull(),
    ticketId: int("ticketId")
    .references(() => tickets.id)
    .notNull(),
    type: text("type"), //(Actualización, Ticket Rechazado, Ticket Finalizado)
    state: text("state"), //(leído o no por el creador asignado)
    title: text("title"),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    descriptionIndex: index("description_idx").on(example.description),
  })
);

export const commentsRelations = relations(comments, ({ one }) => ({
  ticket: one(tickets, {
    fields: [comments.ticketId],
    references: [tickets.id],
  }),
}));

export const images = createTable(
  "images",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId").notNull(),
    ticketId: int("ticketId")
    .references(() => tickets.id)
    .notNull(),
    url: text("url"), 
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    urlIndex: index("url_idx").on(example.url),
  })
);

export const imagesRelations = relations(images, ({one}) => ({
  ticket: one(tickets, {
    fields: [images.ticketId],
    references: [tickets.id],
  }),
}));

export const events = createTable(
  "events",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId").notNull(),
    ticketId: int("ticketId")
    .references(() => tickets.id)
    .notNull(),
    type: text("type", { length: 256 }),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    typeIndex: index("type_idx").on(example.type),
  })
);

export const eventsRelations = relations(events, ({one}) => ({
  ticket: one(tickets, {
    fields: [events.ticketId],
    references: [tickets.id],
  }),
}));

export const participants = createTable(
  "participants",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: text("userId").notNull(),
    ticketId: int("ticketId")
    .references(() => tickets.id)
    .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
  },
  (example) => ({
    ticketIdIndex: index("ticketId_idx").on(example.ticketId),
  })
);


export const participantsRelations = relations(participants, ({one}) => ({
  ticket: one(tickets, {
    fields: [participants.ticketId],
    references: [tickets.id],
  }),
}));


