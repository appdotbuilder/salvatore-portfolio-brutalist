import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput, type Project } from '../schema';

/**
 * Handler to create a new portfolio project
 * Accepts project data and persists it to the database
 */
export const createProject = async (input: CreateProjectInput): Promise<Project> => {
  try {
    // Insert project record
    const result = await db.insert(projectsTable)
      .values({
        title: input.title,
        description: input.description,
        technologies: input.technologies,
        demo_url: input.demo_url,
        github_url: input.github_url,
        npm_url: input.npm_url,
        slides_url: input.slides_url,
        image_url: input.image_url,
        display_order: input.display_order
      })
      .returning()
      .execute();

    // Return the created project
    const project = result[0];
    return project;
  } catch (error) {
    console.error('Project creation failed:', error);
    throw error;
  }
};