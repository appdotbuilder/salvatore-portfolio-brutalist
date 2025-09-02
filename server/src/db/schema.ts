import { serial, text, pgTable, timestamp, integer, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Projects table for portfolio items
export const projectsTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  technologies: json('technologies').$type<string[]>().notNull(), // Array of technology strings
  demo_url: text('demo_url'), // Nullable by default
  github_url: text('github_url'), // Nullable by default
  npm_url: text('npm_url'), // Nullable by default
  slides_url: text('slides_url'), // Nullable by default
  image_url: text('image_url'), // Nullable by default
  display_order: integer('display_order').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Contact form submissions table
export const contactFormsTable = pgTable('contact_forms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  replied: boolean('replied').default(false).notNull(),
});

// Skill categories table (Programming Languages, Frameworks, etc.)
export const skillCategoriesTable = pgTable('skill_categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  display_order: integer('display_order').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Skills table
export const skillsTable = pgTable('skills', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category_id: integer('category_id').notNull(),
  proficiency_level: integer('proficiency_level').notNull(), // 1-5 scale
  display_order: integer('display_order').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Professional info table (about section data)
export const professionalInfoTable = pgTable('professional_info', {
  id: serial('id').primaryKey(),
  full_name: text('full_name').notNull(),
  title: text('title').notNull(),
  bio: text('bio').notNull(),
  location: text('location').notNull(),
  years_experience: integer('years_experience').notNull(),
  current_position: text('current_position').notNull(),
  current_company: text('current_company').notNull(),
  team_size: integer('team_size'), // Nullable by default
  cv_url: text('cv_url'), // Nullable by default
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Define relations
export const skillCategoriesRelations = relations(skillCategoriesTable, ({ many }) => ({
  skills: many(skillsTable),
}));

export const skillsRelations = relations(skillsTable, ({ one }) => ({
  category: one(skillCategoriesTable, {
    fields: [skillsTable.category_id],
    references: [skillCategoriesTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Project = typeof projectsTable.$inferSelect;
export type NewProject = typeof projectsTable.$inferInsert;

export type ContactForm = typeof contactFormsTable.$inferSelect;
export type NewContactForm = typeof contactFormsTable.$inferInsert;

export type SkillCategory = typeof skillCategoriesTable.$inferSelect;
export type NewSkillCategory = typeof skillCategoriesTable.$inferInsert;

export type Skill = typeof skillsTable.$inferSelect;
export type NewSkill = typeof skillsTable.$inferInsert;

export type ProfessionalInfo = typeof professionalInfoTable.$inferSelect;
export type NewProfessionalInfo = typeof professionalInfoTable.$inferInsert;

// Export all tables for proper query building
export const tables = { 
  projects: projectsTable,
  contactForms: contactFormsTable,
  skillCategories: skillCategoriesTable,
  skills: skillsTable,
  professionalInfo: professionalInfoTable
};