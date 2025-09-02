import type { Skill, SkillCategory } from '../../../server/src/schema';

interface SkillsSectionProps {
  categories: SkillCategory[];
  skills: Skill[];
}

export function SkillsSection({ categories, skills }: SkillsSectionProps) {
  // Note: categories and skills props are available for future dynamic implementation
  // Currently using static data as per requirements
  console.log('Available categories:', categories.length, 'skills:', skills.length);
  
  // Static data matching the requirements since API returns minimal data
  const skillsData = {
    "Linguaggi di Programmazione": [
      "HTML5", "CSS 3", "JavaScript", "TypeScript", "SQL", "ABAP", "Python", "Rust (learning)", "Swift (learning)"
    ],
    "Frameworks": [
      "Node.js", "SAPUI5", "React", "React Native", "Next.js", "Astro", "Lit", "Three.js"
    ],
    "Tecnologie SAP": [
      "SAP BTP", "SAP HANA", "SAP NetWeaver", "SAP oData", "SAP CAP", "SAP Workflow", "SAP Build Process Automation"
    ],
    "Tecnologie non SAP": [
      "Fastify", "Supabase", "PostgreSQL", "MongoDB", "Redis", "RabbitMQ"
    ],
    "Infrastructures": [
      "Cloud Foundry", "Docker", "Kubernetes", "AWS", "Oracle", "Netlify", "Vercel"
    ],
    "Other": [
      "Linux", "Git", "Jenkins", "WebdriverIO"
    ]
  };

  return (
    <section id="skills" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="brutal-section-title mb-12">
          TECH STACK
        </h2>

        <div className="grid gap-8">
          {Object.entries(skillsData).map(([category, techs], categoryIndex) => (
            <div key={category} className="brutal-card">
              <h3 className="brutal-subtitle mb-4">
                {category.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {techs.map((tech, index) => (
                  <div 
                    key={tech}
                    className={`brutal-card ${
                      (categoryIndex + index) % 4 === 0 ? 'brutal-card-accent' : ''
                    } text-center`}
                  >
                    <div className="brutal-text font-bold text-xs">
                      {tech}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency Legend */}
        <div className="mt-8 brutal-card brutal-card-accent">
          <div className="brutal-text text-center">
            <strong>FOCUS AREAS:</strong> React Ecosystem • Node.js • TypeScript • SAP BTP • Three.js • Cloud Infrastructure
          </div>
        </div>
      </div>
    </section>
  );
}