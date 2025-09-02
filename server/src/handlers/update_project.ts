import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput, type Project } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * Handler to update an existing portfolio project
 * Updates only the provided fields, leaves others unchanged
 */
export const updateProject = async (input: UpdateProjectInput): Promise<Project> => {
  try {
    // Build update object with only provided fields
    const updateData: Partial<typeof projectsTable.$inferInsert> = {};
    
    if (input.title !== undefined) {
      updateData.title = input.title;
    }
    
    if (input.description !== undefined) {
      updateData.description = input.description;
    }
    
    if (input.technologies !== undefined) {
      updateData.technologies = input.technologies;
    }
    
    if (input.demo_url !== undefined) {
      updateData.demo_url = input.demo_url;
    }
    
    if (input.github_url !== undefined) {
      updateData.github_url = input.github_url;
    }
    
    if (input.npm_url !== undefined) {
      updateData.npm_url = input.npm_url;
    }
    
    if (input.slides_url !== undefined) {
      updateData.slides_url = input.slides_url;
    }
    
    if (input.image_url !== undefined) {
      updateData.image_url = input.image_url;
    }
    
    if (input.display_order !== undefined) {
      updateData.display_order = input.display_order;
    }

    // Update project in database
    const result = await db.update(projectsTable)
      .set(updateData)
      .where(eq(projectsTable.id, input.id))
      .returning()
      .execute();

    if (result.length === 0) {
      throw new Error(`Project with ID ${input.id} not found`);
    }

    return result[0];
  } catch (error) {
    console.error('Project update failed:', error);
    throw error;
  }
};