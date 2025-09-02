import type { Project } from '../../../server/src/schema';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  // Static project data since API returns minimal data
  const staticProjects = [
    {
      id: 1,
      title: "Telegram Bot Config Reality",
      description: "Un bot per la configurazione di oggetti 3D",
      technologies: ["Node.js", "Telegram API"],
      demo_url: "https://example.com/demo",
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    },
    {
      id: 2,
      title: "Cubo Pazzesco",
      description: "Un cubo pazzesco in 3D",
      technologies: ["JavaScript", "ThreeJS"],
      demo_url: "https://example.com/demo",
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    },
    {
      id: 3,
      title: "viewer-3d-lit-loader",
      description: "Un loader per il viewer 3d",
      technologies: ["Lit Element", "TypeScript", "Three.js"],
      demo_url: null,
      github_url: "https://github.com/example/repo",
      npm_url: "https://npmjs.com/package/example",
      slides_url: null
    },
    {
      id: 4,
      title: "Advanced JavaScript",
      description: "Un corso di approfondimento su Javascript",
      technologies: ["JavaScript"],
      demo_url: null,
      github_url: null,
      npm_url: null,
      slides_url: "https://slides.com/example"
    },
    {
      id: 5,
      title: "HTTP like RESTfull vs OData",
      description: "SAP ed i suoi standard.. Restfull vs OData, un confronto tra due protocolli di comunicazione",
      technologies: ["JavaScript"],
      demo_url: null,
      github_url: null,
      npm_url: null,
      slides_url: "https://slides.com/example"
    },
    {
      id: 6,
      title: "Config Reality",
      description: "L'idea iniziale era di creare un configuratore di teste di moro (essendo di Caltagirone, città della ceramica) in 2D sovrapponendo le foto con i vari componenti.. poi ho conosciuto il magico mondo di Three js…",
      technologies: ["React.js", "Three.js"],
      demo_url: "https://example.com/demo",
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    },
    {
      id: 7,
      title: "Minesweeper",
      description: "Non sopportavo le pubblicità del mio giochino preferito..",
      technologies: ["Vite", "React"],
      demo_url: "https://example.com/demo",
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    },
    {
      id: 8,
      title: "Reinventing Minecraft Soil Generator",
      description: "Ispirato da un video youtube di Henrik Kniberg ho dovuto provare con mano la generazione del terreno di minecraft",
      technologies: ["Vanilla JS", "React", "ThreeJS"],
      demo_url: "https://example.com/demo",
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    },
    {
      id: 9,
      title: "sql-odata",
      description: "Idea di realizzare un plugin fastify o una possibile integrazione Platformatic che permette di esporre con il protocollo oData v2, utilizzato come standard dalle applicazioni SAP Fiori, le entità di un database relazionale",
      technologies: ["Node.js", "Fastify", "Platformatic"],
      demo_url: null,
      github_url: "https://github.com/example/repo",
      npm_url: null,
      slides_url: null
    }
  ];

  const displayProjects = projects.length > 0 ? projects : staticProjects;

  const getLinkIcon = (type: 'demo' | 'github' | 'npm' | 'slides') => {
    switch (type) {
      case 'demo': return '🚀';
      case 'github': return '📁';
      case 'npm': return '📦';
      case 'slides': return '📊';
      default: return '🔗';
    }
  };

  return (
    <section id="projects" className="py-8 bg-gray-100">
      <div className="w-full">
        <h2 className="brutal-section-title mb-16">
          PROJECTS
        </h2>

        <div className="brutal-grid brutal-grid-2 lg:grid-cols-3 gap-6">
          {displayProjects.map((project, index) => (
            <div 
              key={project.id}
              className={`brutal-card ${index % 5 === 0 ? 'brutal-card-accent' : ''} hover-parent`}
            >
              {/* Project Title */}
              <h3 className="brutal-subtitle text-lg mb-3">
                {project.title.toUpperCase()}
              </h3>

              {/* Description */}
              <p className="brutal-text mb-4 text-sm leading-relaxed">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="brutal-text text-xs bg-black text-white px-2 py-1 font-bold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2">
                {project.demo_url && (
                  <a 
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-link text-xs"
                  >
                    {getLinkIcon('demo')} DEMO
                  </a>
                )}
                {project.github_url && (
                  <a 
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-link text-xs"
                  >
                    {getLinkIcon('github')} GITHUB
                  </a>
                )}
                {project.npm_url && (
                  <a 
                    href={project.npm_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-link text-xs"
                  >
                    {getLinkIcon('npm')} NPM
                  </a>
                )}
                {project.slides_url && (
                  <a 
                    href={project.slides_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-link text-xs"
                  >
                    {getLinkIcon('slides')} SLIDES
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <div className="brutal-card brutal-card-accent inline-block">
            <p className="brutal-text">
              <strong>CURIOSO DI VEDERE DI PIÙ?</strong> Visita il mio GitHub per progetti aggiornati e contributi open source.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}