import { db } from '../db';
import { skillCategoriesTable, skillsTable } from '../db/schema';
import { type Skill, type SkillCategory } from '../schema';
import { asc } from 'drizzle-orm';

/**
 * Handler to fetch all skills grouped by categories
 * Returns skills with their categories for the skills section
 */
export const getSkills = async (): Promise<{ categories: SkillCategory[], skills: Skill[] }> => {
  try {
    // Fetch all skill categories ordered by display_order
    const categories = await db.select()
      .from(skillCategoriesTable)
      .orderBy(asc(skillCategoriesTable.display_order))
      .execute();

    // Fetch all skills ordered by display_order
    const skills = await db.select()
      .from(skillsTable)
      .orderBy(asc(skillsTable.display_order))
      .execute();

    return { categories, skills };
  } catch (error) {
    console.error('Failed to fetch skills:', error);
    throw error;
  }
};