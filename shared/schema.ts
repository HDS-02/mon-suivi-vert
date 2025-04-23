import { pgTable, text, serial, integer, boolean, timestamp, json, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Plant table
export const plants = pgTable("plants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  species: text("species"),
  status: text("status").notNull().default("healthy"), // healthy, warning, danger
  image: text("image"),
  dateAdded: timestamp("date_added").defaultNow(),
  wateringFrequency: integer("watering_frequency"), // days
  light: text("light"), // indirect, direct, shade
  temperature: text("temperature"), // optimal temperature range
  careNotes: text("care_notes"),
  userId: integer("user_id").notNull().default(1), // Foreign key to users table
});

// Plant analysis history
export const plantAnalyses = pgTable("plant_analyses", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull(),
  image: text("image"),
  aiAnalysis: json("ai_analysis"), // Store full AI response
  healthIssues: text("health_issues"),
  recommendations: text("recommendations"),
});

// Tasks table for reminders and actions
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  plantId: integer("plant_id").notNull(),
  type: text("type").notNull(), // water, fertilize, repot, move, etc.
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  completed: boolean("completed").default(false),
  dateCompleted: timestamp("date_completed"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  plants: many(plants),
}));

export const plantsRelations = relations(plants, ({ one, many }) => ({
  user: one(users, {
    fields: [plants.userId],
    references: [users.id],
  }),
  analyses: many(plantAnalyses),
  tasks: many(tasks),
}));

export const plantAnalysesRelations = relations(plantAnalyses, ({ one }) => ({
  plant: one(plants, {
    fields: [plantAnalyses.plantId],
    references: [plants.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  plant: one(plants, {
    fields: [tasks.plantId],
    references: [plants.id],
  }),
}));

// Schemas for inserting data
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPlantSchema = createInsertSchema(plants).omit({
  id: true,
  dateAdded: true,
});

export const insertPlantAnalysisSchema = createInsertSchema(plantAnalyses).omit({
  id: true,
  date: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
});

// Types 
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Plant = typeof plants.$inferSelect;
export type InsertPlant = z.infer<typeof insertPlantSchema>;

export type PlantAnalysis = typeof plantAnalyses.$inferSelect;
export type InsertPlantAnalysis = z.infer<typeof insertPlantAnalysisSchema>;

export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;

// API response types for AI analysis
export interface PlantAnalysisResponse {
  plantName?: string;
  species?: string;
  status: "healthy" | "warning" | "danger";
  healthIssues?: string[];
  recommendations: string[];
  careInstructions: {
    watering?: string;
    light?: string;
    temperature?: string;
    additional?: string[];
  };
}
