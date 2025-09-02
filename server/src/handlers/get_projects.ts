import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type Project } from '../schema';
import { asc } from 'drizzle-orm';

/**
 * Handler to fetch all projects ordered by display_order
 * Returns portfolio projects for the main portfolio section
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    // Fetch all projects ordered by display_order
    const results = await db.select()
      .from(projectsTable)
      .orderBy(asc(projectsTable.display_order))
      .execute();

    // Return results with proper type structure
    return results.map(project => ({
      ...project,
      // Ensure technologies array is properly handled (it's stored as JSON)
      technologies: project.technologies as string[]
    }));
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
};