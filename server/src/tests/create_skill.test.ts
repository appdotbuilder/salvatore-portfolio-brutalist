import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillsTable, skillCategoriesTable } from '../db/schema';
import { type CreateSkillInput } from '../schema';
import { createSkill } from '../handlers/create_skill';
import { eq } from 'drizzle-orm';

describe('createSkill', () => {
  let categoryId: number;

  beforeEach(async () => {
    await createDB();
    
    // Create a test skill category first since skills require a valid category_id
    const categoryResult = await db.insert(skillCategoriesTable)
      .values({
        name: 'Programming Languages',
        display_order: 1
      })
      .returning()
      .execute();
    
    categoryId = categoryResult[0].id;
  });

  afterEach(resetDB);

  const testInput: CreateSkillInput = {
    name: 'TypeScript',
    category_id: 0, // Will be set dynamically in tests
    proficiency_level: 4,
    display_order: 1
  };

  it('should create a skill successfully', async () => {
    const input = { ...testInput, category_id: categoryId };
    const result = await createSkill(input);

    // Basic field validation
    expect(result.name).toEqual('TypeScript');
    expect(result.category_id).toEqual(categoryId);
    expect(result.proficiency_level).toEqual(4);
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save skill to database', async () => {
    const input = { ...testInput, category_id: categoryId };
    const result = await createSkill(input);

    // Query database to verify skill was saved
    const skills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.id, result.id))
      .execute();

    expect(skills).toHaveLength(1);
    expect(skills[0].name).toEqual('TypeScript');
    expect(skills[0].category_id).toEqual(categoryId);
    expect(skills[0].proficiency_level).toEqual(4);
    expect(skills[0].display_order).toEqual(1);
    expect(skills[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle different proficiency levels', async () => {
    const levels = [1, 2, 3, 4, 5];
    
    for (const level of levels) {
      const input = { 
        ...testInput, 
        name: `Skill Level ${level}`,
        category_id: categoryId,
        proficiency_level: level 
      };
      
      const result = await createSkill(input);
      expect(result.proficiency_level).toEqual(level);
    }
  });

  it('should handle different display orders', async () => {
    const orders = [0, 1, 5, 10, 100];
    
    for (const order of orders) {
      const input = { 
        ...testInput, 
        name: `Skill Order ${order}`,
        category_id: categoryId,
        display_order: order 
      };
      
      const result = await createSkill(input);
      expect(result.display_order).toEqual(order);
    }
  });

  it('should reject skill creation with non-existent category', async () => {
    const input = { ...testInput, category_id: 99999 }; // Non-existent category ID
    
    await expect(createSkill(input)).rejects.toThrow(/category with id 99999 does not exist/i);
  });

  it('should create multiple skills for the same category', async () => {
    const skills = [
      { ...testInput, name: 'JavaScript', category_id: categoryId, display_order: 1 },
      { ...testInput, name: 'Python', category_id: categoryId, display_order: 2 },
      { ...testInput, name: 'Java', category_id: categoryId, display_order: 3 }
    ];

    const results = [];
    for (const skill of skills) {
      results.push(await createSkill(skill));
    }

    expect(results).toHaveLength(3);
    expect(results[0].name).toEqual('JavaScript');
    expect(results[1].name).toEqual('Python');
    expect(results[2].name).toEqual('Java');

    // Verify all have the same category_id
    results.forEach(result => {
      expect(result.category_id).toEqual(categoryId);
    });
  });

  it('should create skills with different names in same category', async () => {
    const skillNames = ['React', 'Vue.js', 'Angular', 'Svelte'];
    
    for (let i = 0; i < skillNames.length; i++) {
      const input = {
        ...testInput,
        name: skillNames[i],
        category_id: categoryId,
        display_order: i + 1
      };
      
      const result = await createSkill(input);
      expect(result.name).toEqual(skillNames[i]);
      expect(result.display_order).toEqual(i + 1);
    }

    // Verify all skills were created
    const allSkills = await db.select()
      .from(skillsTable)
      .where(eq(skillsTable.category_id, categoryId))
      .execute();

    expect(allSkills).toHaveLength(skillNames.length);
  });

  it('should create skills across multiple categories', async () => {
    // Create another category
    const category2Result = await db.insert(skillCategoriesTable)
      .values({
        name: 'Frameworks',
        display_order: 2
      })
      .returning()
      .execute();
    
    const category2Id = category2Result[0].id;

    // Create skills in both categories
    const skill1 = await createSkill({
      ...testInput,
      name: 'TypeScript',
      category_id: categoryId
    });

    const skill2 = await createSkill({
      ...testInput,
      name: 'React',
      category_id: category2Id
    });

    expect(skill1.category_id).toEqual(categoryId);
    expect(skill2.category_id).toEqual(category2Id);
    expect(skill1.name).toEqual('TypeScript');
    expect(skill2.name).toEqual('React');
  });
});