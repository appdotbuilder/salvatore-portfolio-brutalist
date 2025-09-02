import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { projectsTable } from '../db/schema';
import { type CreateProjectInput } from '../schema';
import { getProjects } from '../handlers/get_projects';

// Test project data
const testProject1: CreateProjectInput = {
  title: 'Test Project Alpha',
  description: 'A comprehensive web application for testing',
  technologies: ['React', 'TypeScript', 'Node.js'],
  demo_url: 'https://demo-alpha.example.com',
  github_url: 'https://github.com/user/alpha',
  npm_url: 'https://npmjs.com/package/alpha',
  slides_url: 'https://slides.example.com/alpha',
  image_url: 'https://images.example.com/alpha.png',
  display_order: 2
};

const testProject2: CreateProjectInput = {
  title: 'Test Project Beta',
  description: 'Mobile application with advanced features',
  technologies: ['React Native', 'JavaScript', 'Firebase'],
  demo_url: null,
  github_url: 'https://github.com/user/beta',
  npm_url: null,
  slides_url: null,
  image_url: 'https://images.example.com/beta.jpg',
  display_order: 1
};

const testProject3: CreateProjectInput = {
  title: 'Test Project Gamma',
  description: 'Backend API service for microservices architecture',
  technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'],
  demo_url: 'https://api-gamma.example.com',
  github_url: null,
  npm_url: null,
  slides_url: 'https://slides.example.com/gamma',
  image_url: null,
  display_order: 3
};

describe('getProjects', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no projects exist', async () => {
    const result = await getProjects();
    
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return single project with correct structure', async () => {
    // Insert test project
    await db.insert(projectsTable)
      .values({
        title: testProject1.title,
        description: testProject1.description,
        technologies: testProject1.technologies,
        demo_url: testProject1.demo_url,
        github_url: testProject1.github_url,
        npm_url: testProject1.npm_url,
        slides_url: testProject1.slides_url,
        image_url: testProject1.image_url,
        display_order: testProject1.display_order
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    
    const project = result[0];
    expect(project.title).toEqual('Test Project Alpha');
    expect(project.description).toEqual(testProject1.description);
    expect(project.technologies).toEqual(['React', 'TypeScript', 'Node.js']);
    expect(project.demo_url).toEqual('https://demo-alpha.example.com');
    expect(project.github_url).toEqual('https://github.com/user/alpha');
    expect(project.npm_url).toEqual('https://npmjs.com/package/alpha');
    expect(project.slides_url).toEqual('https://slides.example.com/alpha');
    expect(project.image_url).toEqual('https://images.example.com/alpha.png');
    expect(project.display_order).toEqual(2);
    expect(project.id).toBeDefined();
    expect(project.created_at).toBeInstanceOf(Date);
    
    // Verify technologies is properly typed array
    expect(Array.isArray(project.technologies)).toBe(true);
    expect(project.technologies.length).toBe(3);
  });

  it('should return multiple projects ordered by display_order', async () => {
    // Insert multiple projects in random order
    await db.insert(projectsTable)
      .values([
        {
          title: testProject1.title,
          description: testProject1.description,
          technologies: testProject1.technologies,
          demo_url: testProject1.demo_url,
          github_url: testProject1.github_url,
          npm_url: testProject1.npm_url,
          slides_url: testProject1.slides_url,
          image_url: testProject1.image_url,
          display_order: testProject1.display_order
        },
        {
          title: testProject3.title,
          description: testProject3.description,
          technologies: testProject3.technologies,
          demo_url: testProject3.demo_url,
          github_url: testProject3.github_url,
          npm_url: testProject3.npm_url,
          slides_url: testProject3.slides_url,
          image_url: testProject3.image_url,
          display_order: testProject3.display_order
        },
        {
          title: testProject2.title,
          description: testProject2.description,
          technologies: testProject2.technologies,
          demo_url: testProject2.demo_url,
          github_url: testProject2.github_url,
          npm_url: testProject2.npm_url,
          slides_url: testProject2.slides_url,
          image_url: testProject2.image_url,
          display_order: testProject2.display_order
        }
      ])
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(3);
    
    // Verify correct ordering by display_order (1, 2, 3)
    expect(result[0].title).toEqual('Test Project Beta'); // display_order: 1
    expect(result[0].display_order).toEqual(1);
    
    expect(result[1].title).toEqual('Test Project Alpha'); // display_order: 2
    expect(result[1].display_order).toEqual(2);
    
    expect(result[2].title).toEqual('Test Project Gamma'); // display_order: 3
    expect(result[2].display_order).toEqual(3);
  });

  it('should handle projects with nullable fields correctly', async () => {
    // Insert project with various null values
    await db.insert(projectsTable)
      .values({
        title: testProject2.title,
        description: testProject2.description,
        technologies: testProject2.technologies,
        demo_url: testProject2.demo_url, // null
        github_url: testProject2.github_url,
        npm_url: testProject2.npm_url, // null
        slides_url: testProject2.slides_url, // null
        image_url: testProject2.image_url,
        display_order: testProject2.display_order
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    
    const project = result[0];
    expect(project.title).toEqual('Test Project Beta');
    expect(project.demo_url).toBeNull();
    expect(project.npm_url).toBeNull();
    expect(project.slides_url).toBeNull();
    expect(project.github_url).toEqual('https://github.com/user/beta');
    expect(project.image_url).toEqual('https://images.example.com/beta.jpg');
  });

  it('should handle projects with complex technologies arrays', async () => {
    const complexTech = ['TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Vercel'];
    
    await db.insert(projectsTable)
      .values({
        title: 'Complex Tech Stack Project',
        description: 'A project with many technologies',
        technologies: complexTech,
        demo_url: 'https://complex.example.com',
        github_url: 'https://github.com/user/complex',
        npm_url: null,
        slides_url: null,
        image_url: null,
        display_order: 1
      })
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(1);
    
    const project = result[0];
    expect(project.technologies).toEqual(complexTech);
    expect(project.technologies.length).toBe(7);
    expect(project.technologies.includes('TypeScript')).toBe(true);
    expect(project.technologies.includes('Vercel')).toBe(true);
  });

  it('should handle projects with same display_order consistently', async () => {
    // Insert projects with same display_order to test consistent ordering
    await db.insert(projectsTable)
      .values([
        {
          title: 'Project A',
          description: 'First project with same order',
          technologies: ['Tech1'],
          demo_url: null,
          github_url: null,
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 1
        },
        {
          title: 'Project B',
          description: 'Second project with same order',
          technologies: ['Tech2'],
          demo_url: null,
          github_url: null,
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 1
        }
      ])
      .execute();

    const result = await getProjects();

    expect(result).toHaveLength(2);
    expect(result[0].display_order).toEqual(1);
    expect(result[1].display_order).toEqual(1);
    
    // Should return consistent results on multiple calls
    const result2 = await getProjects();
    expect(result[0].title).toEqual(result2[0].title);
    expect(result[1].title).toEqual(result2[1].title);
  });
});