import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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
  userId: text("user_id").default("default"), // For future use, can identify different users
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

// Schemas for inserting data
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
