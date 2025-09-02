import { type Skill, type SkillCategory } from '../schema';

/**
 * Handler to fetch all skills grouped by categories
 * Returns skills with their categories for the skills section
 */
export const getSkills = async (): Promise<{ categories: SkillCategory[], skills: Skill[] }> => {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is fetching all skills and categories from the database.
    // Should return skills grouped by categories, ordered by display_order
    
    const categories: SkillCategory[] = [
        {
            id: 1,
            name: "Linguaggi di Programmazione",
            display_order: 1,
            created_at: new Date()
        },
        {
            id: 2,
            name: "Frameworks",
            display_order: 2,
            created_at: new Date()
        }
    ];

    const skills: Skill[] = [
        {
            id: 1,
            name: "HTML5",
            category_id: 1,
            proficiency_level: 5,
            display_order: 1,
            created_at: new Date()
        },
        {
            id: 2,
            name: "React",
            category_id: 2,
            proficiency_level: 5,
            display_order: 1,
            created_at: new Date()
        }
    ];

    return { categories, skills };
};