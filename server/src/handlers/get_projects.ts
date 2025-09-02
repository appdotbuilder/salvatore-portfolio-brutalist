import { type Project } from '../schema';

/**
 * Handler to fetch all projects ordered by display_order
 * Returns portfolio projects for the main portfolio section
 */
export const getProjects = async (): Promise<Project[]> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all projects from the database ordered by display_order.
    // Should include: title, description, technologies, demo/github/npm/slides URLs, image_url
    
    return [
        {
            id: 1,
            title: "Telegram Bot Config Reality",
            description: "Un bot per la configurazione di oggetti 3D",
            technologies: ["Node.js", "Telegram API"],
            demo_url: "https://example.com/demo",
            github_url: "https://github.com/example/repo",
            npm_url: null,
            slides_url: null,
            image_url: null,
            display_order: 1,
            created_at: new Date()
        }
    ];
};