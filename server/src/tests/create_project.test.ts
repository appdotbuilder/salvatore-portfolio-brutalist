import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { createProject } from '../handlers/create_project';
import { eq } from 'drizzle-orm';

// Simple test input with all required fields
const testInput: CreateProjectInput = {
  title: 'Test Portfolio Project',
  description: 'A comprehensive portfolio project for testing',
  technologies: ['TypeScript', 'React', 'Node.js'],
  demo_url: 'https://demo.example.com',
  github_url: 'https://github.com/user/project',
  npm_url: 'https://npmjs.com/package/test-project',
  slides_url: 'https://slides.example.com/presentation',
  image_url: 'https://images.example.com/screenshot.png',
  display_order: 1
};

// Minimal test input with nullable fields
const minimalInput: CreateProjectInput = {
  title: 'Minimal Project',
  description: 'A minimal project with only required fields',
  technologies: ['JavaScript'],
  demo_url: null,
  github_url: null,
  npm_url: null,
  slides_url: null,
  image_url: null,
  display_order: 0
};

describe('createProject', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a project with all fields', async () => {
    const result = await createProject(testInput);

    // Basic field validation
    expect(result.title).toEqual('Test Portfolio Project');
    expect(result.description).toEqual(testInput.description);
    expect(result.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(result.demo_url).toEqual('https://demo.example.com');
    expect(result.github_url).toEqual('https://github.com/user/project');
    expect(result.npm_url).toEqual('https://npmjs.com/package/test-project');
    expect(result.slides_url).toEqual('https://slides.example.com/presentation');
    expect(result.image_url).toEqual('https://images.example.com/screenshot.png');
    expect(result.display_order).toEqual(1);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create a project with nullable fields set to null', async () => {
    const result = await createProject(minimalInput);

    expect(result.title).toEqual('Minimal Project');
    expect(result.description).toEqual(minimalInput.description);
    expect(result.technologies).toEqual(['JavaScript']);
    expect(result.demo_url).toBeNull();
    expect(result.github_url).toBeNull();
    expect(result.npm_url).toBeNull();
    expect(result.slides_url).toBeNull();
    expect(result.image_url).toBeNull();
    expect(result.display_order).toEqual(0);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save project to database correctly', async () => {
    const result = await createProject(testInput);

    // Query database using proper drizzle syntax
    const projects = await db.select()
      .from(projectsTable)
      .where(eq(projectsTable.id, result.id))
      .execute();

    expect(projects).toHaveLength(1);
    const savedProject = projects[0];

    expect(savedProject.title).toEqual('Test Portfolio Project');
    expect(savedProject.description).toEqual(testInput.description);
    expect(savedProject.technologies).toEqual(['TypeScript', 'React', 'Node.js']);
    expect(savedProject.demo_url).toEqual('https://demo.example.com');
    expect(savedProject.github_url).toEqual('https://github.com/user/project');
    expect(savedProject.npm_url).toEqual('https://npmjs.com/package/test-project');
    expect(savedProject.slides_url).toEqual('https://slides.example.com/presentation');
    expect(savedProject.image_url).toEqual('https://images.example.com/screenshot.png');
    expect(savedProject.display_order).toEqual(1);
    expect(savedProject.created_at).toBeInstanceOf(Date);
  });

  it('should handle projects with different display orders', async () => {
    // Create multiple projects with different display orders
    const project1 = await createProject({
      ...testInput,
      title: 'First Project',
      display_order: 1
    });

    const project2 = await createProject({
      ...testInput,
      title: 'Second Project',
      display_order: 2
    });

    const project3 = await createProject({
      ...testInput,
      title: 'Featured Project',
      display_order: 0
    });

    // Verify all projects were created with correct display orders
    expect(project1.display_order).toEqual(1);
    expect(project2.display_order).toEqual(2);
    expect(project3.display_order).toEqual(0);

    // Query all projects from database
    const allProjects = await db.select()
      .from(projectsTable)
      .execute();

    expect(allProjects).toHaveLength(3);

    // Verify display orders are preserved
    const displayOrders = allProjects.map(p => p.display_order).sort();
    expect(displayOrders).toEqual([0, 1, 2]);
  });

  it('should handle projects with different technology arrays', async () => {
    // Test single technology
    const singleTechProject = await createProject({
      ...minimalInput,
      title: 'Single Tech Project',
      technologies: ['Python']
    });

    // Test multiple technologies
    const multiTechProject = await createProject({
      ...minimalInput,
      title: 'Multi Tech Project',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']
    });

    expect(singleTechProject.technologies).toEqual(['Python']);
    expect(multiTechProject.technologies).toEqual(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']);

    // Verify in database
    const projects = await db.select()
      .from(projectsTable)
      .execute();

    expect(projects).toHaveLength(2);
    
    const dbSingleTech = projects.find(p => p.title === 'Single Tech Project');
    const dbMultiTech = projects.find(p => p.title === 'Multi Tech Project');

    expect(dbSingleTech?.technologies).toEqual(['Python']);
    expect(dbMultiTech?.technologies).toEqual(['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']);
  });
});