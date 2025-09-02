import { z } from 'zod';

// Project schema for portfolio items
export const projectSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  technologies: z.array(z.string()),
  demo_url: z.string().nullable(),
  github_url: z.string().nullable(),
  npm_url: z.string().nullable(),
  slides_url: z.string().nullable(),
  image_url: z.string().nullable(),
  display_order: z.number().int(),
  created_at: z.coerce.date()
});

export type Project = z.infer<typeof projectSchema>;

// Input schema for creating projects
export const createProjectInputSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  technologies: z.array(z.string()).min(1),
  demo_url: z.string().url().nullable(),
  github_url: z.string().url().nullable(),
  npm_url: z.string().url().nullable(),
  slides_url: z.string().url().nullable(),
  image_url: z.string().url().nullable(),
  display_order: z.number().int().nonnegative()
});

export type CreateProjectInput = z.infer<typeof createProjectInputSchema>;

// Input schema for updating projects
export const updateProjectInputSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).min(1).optional(),
  demo_url: z.string().url().nullable().optional(),
  github_url: z.string().url().nullable().optional(),
  npm_url: z.string().url().nullable().optional(),
  slides_url: z.string().url().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  display_order: z.number().int().nonnegative().optional()
});

export type UpdateProjectInput = z.infer<typeof updateProjectInputSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
  created_at: z.coerce.date(),
  replied: z.boolean()
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// Input schema for contact form submission
export const createContactFormInputSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email().max(255),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(2000)
});

export type CreateContactFormInput = z.infer<typeof createContactFormInputSchema>;

// Skill category schema
export const skillCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  display_order: z.number().int(),
  created_at: z.coerce.date()
});

export type SkillCategory = z.infer<typeof skillCategorySchema>;

// Skill schema
export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  category_id: z.number(),
  proficiency_level: z.number().int().min(1).max(5),
  display_order: z.number().int(),
  created_at: z.coerce.date()
});

export type Skill = z.infer<typeof skillSchema>;

// Input schema for creating skills
export const createSkillInputSchema = z.object({
  name: z.string().min(1).max(100),
  category_id: z.number(),
  proficiency_level: z.number().int().min(1).max(5),
  display_order: z.number().int().nonnegative()
});

export type CreateSkillInput = z.infer<typeof createSkillInputSchema>;

// Professional info schema (for about section)
export const professionalInfoSchema = z.object({
  id: z.number(),
  full_name: z.string(),
  title: z.string(),
  bio: z.string(),
  location: z.string(),
  years_experience: z.number().int(),
  current_position: z.string(),
  current_company: z.string(),
  team_size: z.number().int().nullable(),
  cv_url: z.string().nullable(),
  updated_at: z.coerce.date()
});

export type ProfessionalInfo = z.infer<typeof professionalInfoSchema>;

// Input schema for updating professional info
export const updateProfessionalInfoInputSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  title: z.string().min(1).max(100).optional(),
  bio: z.string().max(2000).optional(),
  location: z.string().max(100).optional(),
  years_experience: z.number().int().nonnegative().optional(),
  current_position: z.string().max(100).optional(),
  current_company: z.string().max(100).optional(),
  team_size: z.number().int().nonnegative().nullable().optional(),
  cv_url: z.string().url().nullable().optional()
});

export type UpdateProfessionalInfoInput = z.infer<typeof updateProfessionalInfoInputSchema>;