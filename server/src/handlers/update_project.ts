import { type UpdateProjectInput, type Project } from '../schema';

/**
 * Handler to update an existing portfolio project
 * Updates only the provided fields, leaves others unchanged
 */
export const updateProject = async (input: UpdateProjectInput): Promise<Project> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is updating an existing project in the database.
    // Should validate input, update the project with given ID, and return the updated project
    
    return {
        id: input.id,
        title: input.title || "Existing Title",
        description: input.description || "Existing description",
        technologies: input.technologies || ["Node.js"],
        demo_url: input.demo_url !== undefined ? input.demo_url : null,
        github_url: input.github_url !== undefined ? input.github_url : null,
        npm_url: input.npm_url !== undefined ? input.npm_url : null,
        slides_url: input.slides_url !== undefined ? input.slides_url : null,
        image_url: input.image_url !== undefined ? input.image_url : null,
        display_order: input.display_order || 1,
        created_at: new Date()
    } as Project;
};