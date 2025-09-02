import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { skillCategoriesTable, skillsTable } from '../db/schema';
import { getSkills } from '../handlers/get_skills';

describe('getSkills', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty arrays when no data exists', async () => {
    const result = await getSkills();

    expect(result.categories).toEqual([]);
    expect(result.skills).toEqual([]);
  });

  it('should fetch all categories and skills ordered by display_order', async () => {
    // Create test categories with different display orders
    await db.insert(skillCategoriesTable).values([
      {
        name: 'Frameworks',
        display_order: 2
      },
      {
        name: 'Programming Languages',
        display_order: 1
      },
      {
        name: 'Databases',
        display_order: 3
      }
    ]).execute();

    // Get category IDs for foreign key references
    const categories = await db.select().from(skillCategoriesTable).execute();
    const programmingId = categories.find(c => c.name === 'Programming Languages')!.id;
    const frameworksId = categories.find(c => c.name === 'Frameworks')!.id;
    const databasesId = categories.find(c => c.name === 'Databases')!.id;

    // Create test skills with different display orders
    await db.insert(skillsTable).values([
      {
        name: 'React',
        category_id: frameworksId,
        proficiency_level: 4,
        display_order: 3
      },
      {
        name: 'JavaScript',
        category_id: programmingId,
        proficiency_level: 5,
        display_order: 1
      },
      {
        name: 'TypeScript',
        category_id: programmingId,
        proficiency_level: 4,
        display_order: 2
      },
      {
        name: 'PostgreSQL',
        category_id: databasesId,
        proficiency_level: 3,
        display_order: 4
      }
    ]).execute();

    const result = await getSkills();

    // Verify categories are returned in correct order
    expect(result.categories).toHaveLength(3);
    expect(result.categories[0].name).toEqual('Programming Languages');
    expect(result.categories[0].display_order).toEqual(1);
    expect(result.categories[1].name).toEqual('Frameworks');
    expect(result.categories[1].display_order).toEqual(2);
    expect(result.categories[2].name).toEqual('Databases');
    expect(result.categories[2].display_order).toEqual(3);

    // Verify skills are returned in correct order
    expect(result.skills).toHaveLength(4);
    expect(result.skills[0].name).toEqual('JavaScript');
    expect(result.skills[0].display_order).toEqual(1);
    expect(result.skills[1].name).toEqual('TypeScript');
    expect(result.skills[1].display_order).toEqual(2);
    expect(result.skills[2].name).toEqual('React');
    expect(result.skills[2].display_order).toEqual(3);
    expect(result.skills[3].name).toEqual('PostgreSQL');
    expect(result.skills[3].display_order).toEqual(4);
  });

  it('should include all required fields in returned data', async () => {
    // Create test category
    await db.insert(skillCategoriesTable).values({
      name: 'Test Category',
      display_order: 1
    }).execute();

    const categories = await db.select().from(skillCategoriesTable).execute();
    const categoryId = categories[0].id;

    // Create test skill
    await db.insert(skillsTable).values({
      name: 'Test Skill',
      category_id: categoryId,
      proficiency_level: 3,
      display_order: 1
    }).execute();

    const result = await getSkills();

    // Verify category structure
    const category = result.categories[0];
    expect(category.id).toBeDefined();
    expect(category.name).toEqual('Test Category');
    expect(category.display_order).toEqual(1);
    expect(category.created_at).toBeInstanceOf(Date);

    // Verify skill structure
    const skill = result.skills[0];
    expect(skill.id).toBeDefined();
    expect(skill.name).toEqual('Test Skill');
    expect(skill.category_id).toEqual(categoryId);
    expect(skill.proficiency_level).toEqual(3);
    expect(skill.display_order).toEqual(1);
    expect(skill.created_at).toBeInstanceOf(Date);
  });

  it('should handle skills with proficiency levels 1-5', async () => {
    // Create test category
    await db.insert(skillCategoriesTable).values({
      name: 'Programming Languages',
      display_order: 1
    }).execute();

    const categories = await db.select().from(skillCategoriesTable).execute();
    const categoryId = categories[0].id;

    // Create skills with different proficiency levels
    await db.insert(skillsTable).values([
      {
        name: 'Beginner Skill',
        category_id: categoryId,
        proficiency_level: 1,
        display_order: 1
      },
      {
        name: 'Expert Skill',
        category_id: categoryId,
        proficiency_level: 5,
        display_order: 2
      },
      {
        name: 'Intermediate Skill',
        category_id: categoryId,
        proficiency_level: 3,
        display_order: 3
      }
    ]).execute();

    const result = await getSkills();

    expect(result.skills).toHaveLength(3);
    expect(result.skills[0].proficiency_level).toEqual(1);
    expect(result.skills[1].proficiency_level).toEqual(5);
    expect(result.skills[2].proficiency_level).toEqual(3);
  });

  it('should return skills even when categories exist without skills', async () => {
    // Create categories without any skills
    await db.insert(skillCategoriesTable).values([
      {
        name: 'Empty Category 1',
        display_order: 1
      },
      {
        name: 'Empty Category 2',
        display_order: 2
      }
    ]).execute();

    const result = await getSkills();

    expect(result.categories).toHaveLength(2);
    expect(result.skills).toHaveLength(0);
    expect(result.categories[0].name).toEqual('Empty Category 1');
    expect(result.categories[1].name).toEqual('Empty Category 2');
  });

  it('should maintain correct ordering with mixed display_order values', async () => {
    // Create categories with non-sequential display orders
    await db.insert(skillCategoriesTable).values([
      {
        name: 'Category C',
        display_order: 10
      },
      {
        name: 'Category A',
        display_order: 5
      },
      {
        name: 'Category B',
        display_order: 7
      }
    ]).execute();

    const categories = await db.select().from(skillCategoriesTable).execute();
    const categoryAId = categories.find(c => c.name === 'Category A')!.id;
    const categoryBId = categories.find(c => c.name === 'Category B')!.id;
    const categoryCId = categories.find(c => c.name === 'Category C')!.id;

    // Create skills with non-sequential display orders
    await db.insert(skillsTable).values([
      {
        name: 'Skill Z',
        category_id: categoryCId,
        proficiency_level: 3,
        display_order: 100
      },
      {
        name: 'Skill A',
        category_id: categoryAId,
        proficiency_level: 4,
        display_order: 50
      },
      {
        name: 'Skill M',
        category_id: categoryBId,
        proficiency_level: 2,
        display_order: 75
      }
    ]).execute();

    const result = await getSkills();

    // Categories should be ordered by display_order
    expect(result.categories[0].name).toEqual('Category A');
    expect(result.categories[1].name).toEqual('Category B');
    expect(result.categories[2].name).toEqual('Category C');

    // Skills should be ordered by display_order
    expect(result.skills[0].name).toEqual('Skill A');
    expect(result.skills[1].name).toEqual('Skill M');
    expect(result.skills[2].name).toEqual('Skill Z');
  });
});