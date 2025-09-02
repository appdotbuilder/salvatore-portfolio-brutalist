import type { ProfessionalInfo } from '../../../server/src/schema';

interface AboutSectionProps {
  professionalInfo: ProfessionalInfo | null;
}

export function AboutSection({ professionalInfo }: AboutSectionProps) {
  const mainSkills = [
    'WEBDESIGN',
    'WEB APP',
    'BACK-END',
    'MOBILE DEVELOPER',
    'SOFTWARE ARCHITECT',
    'DEVOPS'
  ];

  return (
    <section id="about" className="py-8 bg-black text-white">
      <div className="w-full">
        <h2 className="brutal-section-title text-white mb-16">
          ABOUT ME
        </h2>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Bio */}
          <div>
            <div className="brutal-text text-gray-300 text-base leading-relaxed mb-8">
              {professionalInfo?.bio || 
                "Sono uno sviluppatore Full Stack proveniente dalla Sicilia ma ormai trasferito a Roma da circa 9 anni. Ho iniziato la mia carriera come sviluppatore Java, ma negli ultimi anni mi sono focalizzato su tecnologie SAP per lavoro mentre mi diletto in progetti personali con tecnologie come React, NodeJS e TypeScript. Ad oggi ricopro il ruolo di SAP BTP Practice Leader (SME) in GotoNext SRL. Sono Team leader di un team di circa 16 persone e mi occupo di progettazione e sviluppo di architetture SAP BTP e infrastrutture on premise."
              }
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 uppercase text-xs font-bold mb-1">Location</div>
                <div className="font-bold">{professionalInfo?.location || 'Roma, Italia'}</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-xs font-bold mb-1">Experience</div>
                <div className="font-bold">{professionalInfo?.years_experience || 9} anni</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-xs font-bold mb-1">Current Role</div>
                <div className="font-bold">{professionalInfo?.current_position || 'SAP BTP Practice Leader'}</div>
              </div>
              <div>
                <div className="text-gray-500 uppercase text-xs font-bold mb-1">Company</div>
                <div className="font-bold">{professionalInfo?.current_company || 'GotoNext SRL'}</div>
              </div>
            </div>
          </div>

          {/* Main Skills */}
          <div>
            <h3 className="brutal-subtitle text-white mb-6">
              MAIN SKILLS
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {mainSkills.map((skill, index) => (
                <div 
                  key={skill}
                  className={`brutal-card ${index % 3 === 0 ? 'brutal-card-accent text-black' : 'border-white text-white'} text-center`}
                >
                  <div className="font-bold text-xs">
                    {skill}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}