import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type UpdateProjectInput } from '../schema';
import { updateProject } from '../handlers/update_project';
import { eq } from 'drizzle-orm';

describe('updateProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create a test project
  const createTestProject = async () => {
    const result = await db.insert(projectsTable)
      .values({
        title: 'Original Title',
        description: 'Original description',
        technologies: ['JavaScript', 'React'],
        demo_url: 'https://original-demo.com',
        github_url: 'https://github.com/original',
        npm_url: 'https://npmjs.com/original',
        slides_url: 'https://slides.com/original',
        image_url: 'https://images.com/original.jpg',
        display_order: 1
      })
      .returning()
      .execute();
    
    return result[0];
  };

  it('should update all fields of a project', async () => {
    const originalProject = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Updated Title',
      description: 'Updated description',
      technologies: ['TypeScript', 'Node.js'],
      demo_url: 'https://updated-demo.com',
      github_url: 'https://github.com/updated',
      npm_url: 'https://npmjs.com/updated',
      slides_url: 'https://slides.com/updated',
      image_url: 'https://images.com/updated.jpg',
      display_order: 5
    };

    const result = await updateProject(updateInput);

    // Verify all fields were updated
    expect(result.id).toEqual(originalProject.id);
    expect(result.title).toEqual('Updated Title');
    expect(result.description).toEqual('Updated description');
    expect(result.technologies).toEqual(['TypeScript', 'Node.js']);
    expect(result.demo_url).toEqual('https://updated-demo.com');
    expect(result.github_url).toEqual('https://github.com/updated');
    expect(result.npm_url).toEqual('https://npmjs.com/updated');
    expect(result.slides_url).toEqual('https://slides.com/updated');
    expect(result.image_url).toEqual('https://images.com/updated.jpg');
    expect(result.display_order).toEqual(5);
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should update only specific fields', async () => {
    const originalProject = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'New Title Only',
      display_order: 10
    };

    const result = await updateProject(updateInput);

    // Verify only specified fields were updated
    expect(result.title).toEqual('New Title Only');
    expect(result.display_order).toEqual(10);
    
    // Verify other fields remained unchanged
    expect(result.description).toEqual('Original description');
    expect(result.technologies).toEqual(['JavaScript', 'React']);
    expect(result.demo_url).toEqual('https://original-demo.com');
    expect(result.github_url).toEqual('https://github.com/original');
  });

  it('should handle nullable fields being set to null', async () => {
    const originalProject = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      demo_url: null,
      github_url: null,
      npm_url: null,
      slides_url: null,
      image_url: null
    };

    const result = await updateProject(updateInput);

    // Verify nullable fields were set to null
    expect(result.demo_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.npm_url).toBeNull();
    expect(result.slides_url).toBeNull();
    expect(result.image_url).toBeNull();
    
    // Verify non-nullable fields remained unchanged
    expect(result.title).toEqual('Original Title');
    expect(result.description).toEqual('Original description');
    expect(result.technologies).toEqual(['JavaScript', 'React']);
  });

  it('should save changes to database', async () => {
    const originalProject = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Database Test Title',
      technologies: ['Python', 'Django']
    };

    await updateProject(updateInput);

    // Query database to verify changes were persisted
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, originalProject.id))
      .execute();

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toEqual('Database Test Title');
    expect(projects[0].technologies).toEqual(['Python', 'Django']);
    expect(projects[0].description).toEqual('Original description'); // Unchanged
  });

  it('should throw error when project does not exist', async () => {
    const updateInput: UpdateProjectInput = {
      id: 99999, // Non-existent ID
      title: 'This should fail'
    };

    await expect(updateProject(updateInput)).rejects.toThrow(/Project with ID 99999 not found/i);
  });

  it('should update technologies array correctly', async () => {
    const originalProject = await createTestProject();
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      technologies: ['Vue.js', 'Nuxt.js', 'TypeScript', 'PostgreSQL']
    };

    const result = await updateProject(updateInput);

    expect(result.technologies).toEqual(['Vue.js', 'Nuxt.js', 'TypeScript', 'PostgreSQL']);
    expect(result.technologies).toHaveLength(4);
    
    // Verify array was stored correctly in database
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, originalProject.id))
      .execute();

    expect(projects[0].technologies).toEqual(['Vue.js', 'Nuxt.js', 'TypeScript', 'PostgreSQL']);
  });

  it('should preserve created_at timestamp', async () => {
    const originalProject = await createTestProject();
    const originalCreatedAt = originalProject.created_at;
    
    // Wait a small amount to ensure timestamp would change if incorrectly updated
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const updateInput: UpdateProjectInput = {
      id: originalProject.id,
      title: 'Timestamp Test'
    };

    const result = await updateProject(updateInput);

    // created_at should remain unchanged
    expect(result.created_at).toEqual(originalCreatedAt);
  });
});