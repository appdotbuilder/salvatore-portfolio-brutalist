import { db } from '../db';
import { projectsTable, professionalInfoTable, skillCategoriesTable, skillsTable } from '../db/schema';

/**
 * Seeds the database with initial data for the portfolio
 */
export const seedData = async (): Promise<void> => {
  try {
    // Check if professional info already exists
    const existingInfo = await db.select().from(professionalInfoTable).limit(1).execute();
    
    if (existingInfo.length === 0) {
      // Insert professional information
      await db.insert(professionalInfoTable).values({
        full_name: 'Salvatore',
        title: 'Senior Full Stack Developer',
        bio: 'Sono uno sviluppatore Full Stack proveniente dalla Sicilia ma ormai trasferito a Roma da circa 9 anni. Ho iniziato la mia carriera come sviluppatore Java, ma negli ultimi anni mi sono focalizzato su tecnologie SAP per lavoro mentre mi diletto in progetti personali con tecnologie come React, NodeJS e TypeScript. Ad oggi ricopro il ruolo di SAP BTP Practice Leader (SME) in GotoNext SRL. Sono Team leader di un team di circa 16 persone e mi occupo di progettazione e sviluppo di architetture SAP BTP e infrastrutture on premise.',
        location: 'Roma, Italia',
        years_experience: 9,
        current_position: 'SAP BTP Practice Leader (SME)',
        current_company: 'GotoNext SRL',
        team_size: 16,
        cv_url: null
      }).execute();
    }

    // Check if projects already exist
    const existingProjects = await db.select().from(projectsTable).limit(1).execute();
    
    if (existingProjects.length === 0) {
      // Insert sample projects
      const projects = [
        {
          title: 'Telegram Bot Config Reality',
          description: 'Un bot per la configurazione di oggetti 3D',
          technologies: ['Node.js', 'Telegram API'],
          demo_url: 'https://example.com/demo',
          github_url: 'https://github.com/example/telegram-bot',
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 1
        },
        {
          title: 'Cubo Pazzesco',
          description: 'Un cubo pazzesco in 3D',
          technologies: ['JavaScript', 'ThreeJS'],
          demo_url: 'https://example.com/cubo-demo',
          github_url: 'https://github.com/example/cubo-pazzesco',
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 2
        },
        {
          title: 'viewer-3d-lit-loader',
          description: 'Un loader per il viewer 3d',
          technologies: ['Lit Element', 'TypeScript', 'Three.js'],
          demo_url: null,
          github_url: 'https://github.com/example/viewer-3d-lit-loader',
          npm_url: 'https://npmjs.com/package/viewer-3d-lit-loader',
          slides_url: null,
          image_url: null,
          display_order: 3
        },
        {
          title: 'Config Reality',
          description: 'L\'idea iniziale era di creare un configuratore di teste di moro (essendo di Caltagirone, città della ceramica) in 2D sovrapponendo le foto con i vari componenti.. poi ho conosciuto il magico mondo di Three js…',
          technologies: ['React.js', 'Three.js'],
          demo_url: 'https://example.com/config-reality',
          github_url: 'https://github.com/example/config-reality',
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 4
        },
        {
          title: 'Minesweeper',
          description: 'Non sopportavo le pubblicità del mio giochino preferito..',
          technologies: ['Vite', 'React'],
          demo_url: 'https://example.com/minesweeper',
          github_url: 'https://github.com/example/minesweeper',
          npm_url: null,
          slides_url: null,
          image_url: null,
          display_order: 5
        }
      ];
      
      for (const project of projects) {
        await db.insert(projectsTable).values(project).execute();
      }
    }

    // Check if skill categories already exist
    const existingCategories = await db.select().from(skillCategoriesTable).limit(1).execute();
    
    if (existingCategories.length === 0) {
      // Insert skill categories
      const categories = [
        { name: 'Linguaggi di Programmazione', display_order: 1 },
        { name: 'Frameworks', display_order: 2 },
        { name: 'Tecnologie SAP', display_order: 3 },
        { name: 'Tecnologie non SAP', display_order: 4 },
        { name: 'Infrastructures', display_order: 5 },
        { name: 'Other', display_order: 6 }
      ];
      
      for (const category of categories) {
        await db.insert(skillCategoriesTable).values(category).execute();
      }
      
      // Insert skills
      const skills = [
        // Programming Languages (category_id: 1)
        { name: 'HTML5', category_id: 1, proficiency_level: 5, display_order: 1 },
        { name: 'CSS 3', category_id: 1, proficiency_level: 5, display_order: 2 },
        { name: 'JavaScript', category_id: 1, proficiency_level: 5, display_order: 3 },
        { name: 'TypeScript', category_id: 1, proficiency_level: 5, display_order: 4 },
        { name: 'SQL', category_id: 1, proficiency_level: 4, display_order: 5 },
        { name: 'ABAP', category_id: 1, proficiency_level: 4, display_order: 6 },
        { name: 'Python', category_id: 1, proficiency_level: 3, display_order: 7 },
        
        // Frameworks (category_id: 2)
        { name: 'Node.js', category_id: 2, proficiency_level: 5, display_order: 1 },
        { name: 'React', category_id: 2, proficiency_level: 5, display_order: 2 },
        { name: 'Next.js', category_id: 2, proficiency_level: 4, display_order: 3 },
        { name: 'Three.js', category_id: 2, proficiency_level: 4, display_order: 4 }
      ];
      
      for (const skill of skills) {
        await db.insert(skillsTable).values(skill).execute();
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};