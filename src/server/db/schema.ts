// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations, sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator((name) => `stip_${name}`);

export const tickets = createTable(
  "tickets",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    orgId: int("orgId")
      .references(() => companies.id)
      .notNull(),
    state: text("state", { length: 256 }),
    urgency: int("urgency"),
    suppUrgency: int("suppUrgency"),
    title: text("title", { length: 256 }),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    titleIndex: index("title_idx").on(example.title),
  }),
);

export const ticketsRelations = relations(tickets, ({ many, one }) => ({
  comments: many(comments),
  reporteElegido: many(reportes),
  participants: many(participants),
  companies: one(companies, {
    fields: [tickets.orgId],
    references: [companies.id],
  }),
}));

export const comments = createTable(
  "comments",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userName: text("userName"),
    ticketId: int("ticketId")
      .references(() => tickets.id)
      .notNull(),
    type: text("type"),
    state: text("state"),
    title: text("title"),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    },
    (example) => ({
      descriptionIndex: index("description_idx").on(example.description),
    }),
  );

  export const companies = createTable("companies", {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    orgId: text("orgId").notNull(),
    name: text("name", { length: 255 }).notNull(),
    razon_social: text("razon_social"),
    description: text("description", { length: 255 }).notNull(),
    state: text("state", { length: 255 }).notNull(),
    phone_number: text("phone_number"),
    address: text("address"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  });

  export const commentsRelations = relations(comments, ({ one }) => ({
    ticket: one(tickets, {
      fields: [comments.ticketId],
      references: [tickets.id],
    }),
    images: one(images),
  }));

export const userCompanies = createTable("userCompanies", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userName: text("userName").notNull(),
  userId: text("userId").notNull(),
  orgId: int("orgId"),
  createdAt: int("created_at", { mode: "timestamp" })
  .default(sql`(unixepoch())`)
  .notNull(),
  updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
    () => new Date(),
  ),
});

export const userCompaniesRelations = relations(userCompanies, ({ one }) => ({
  companies: one(companies, {
    fields: [userCompanies.orgId],
    references: [companies.id],
  }),
}));


export const images = createTable(
  "images",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userName: text("userName").notNull(),
    commentId: int("commentId"),
    url: text("url"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    urlIndex: index("url_idx").on(example.url),
  }),
);

export const imagesRelations = relations(images, ({ one }) => ({
  comments: one(comments, {
    fields: [images.commentId],
    references: [comments.id],
  }),
}));

export const events = createTable(
  "events",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userName: text("userName"),
    ticketId: int("ticketId"),
    commentsId: int("commentsId"),
    type: text("type", { length: 256 }),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  },
  (example) => ({
    typeIndex: index("type_idx").on(example.type),
  }),
);

export const participants = createTable(
  "participants",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    userName: text("userName").notNull(),
    ticketId: int("ticketId")
      .references(() => tickets.id)
      .notNull(),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    ticketIdIndex: index("ticketId_idx").on(example.ticketId),
  }),
);

export const participantsRelations = relations(participants, ({ one }) => ({
  ticket: one(tickets, {
    fields: [participants.ticketId],
    references: [tickets.id],
  }),
}));


export const reportes = createTable(
  "reportes",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    ticketId: int("ticketId")
      .references(() => tickets.id)
      .notNull(),
    type: text("type"),
    title: text("title"),
    description: text("description"),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    },
  );

  export const reportesRelations = relations(reportes, ({ one }) => ({
    ticketElegido: one(tickets, {
      fields: [reportes.ticketId],
      references: [tickets.id],
    }),
  }));
  