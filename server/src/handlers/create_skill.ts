import { db } from '../db';
import { skillsTable, skillCategoriesTable } from '../db/schema';
import { type CreateSkillInput, type Skill } from '../schema';
import { eq } from 'drizzle-orm';

/**
 * Handler to create a new skill entry
 * Associates the skill with a category and sets proficiency level
 */
export const createSkill = async (input: CreateSkillInput): Promise<Skill> => {
  try {
    // First, verify that the skill category exists to prevent foreign key constraint violations
    const existingCategory = await db.select()
      .from(skillCategoriesTable)
      .where(eq(skillCategoriesTable.id, input.category_id))
      .execute();

    if (existingCategory.length === 0) {
      throw new Error(`Skill category with id ${input.category_id} does not exist`);
    }

    // Insert skill record
    const result = await db.insert(skillsTable)
      .values({
        name: input.name,
        category_id: input.category_id,
        proficiency_level: input.proficiency_level,
        display_order: input.display_order
      })
      .returning()
      .execute();

    const skill = result[0];
    return skill;
  } catch (error) {
    console.error('Skill creation failed:', error);
    throw error;
  }
};