import type { ProfessionalInfo } from '../../../server/src/schema';

interface HeroSectionProps {
  professionalInfo: ProfessionalInfo | null;
}

export function HeroSection({ professionalInfo }: HeroSectionProps) {
  const handleDownloadCV = () => {
    if (professionalInfo?.cv_url) {
      window.open(professionalInfo.cv_url, '_blank');
    } else {
      // Placeholder functionality
      alert('CV not available yet');
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-full text-center">
        <h1 className="brutal-title mb-4">
          CIAO SONO<br />
          SALVATORE
        </h1>
        
        <div className="mb-8">
          <p className="brutal-subtitle mb-2">
            {professionalInfo?.title || 'SOFTWARE ENGINEER'}
          </p>
          <p className="brutal-text text-gray-600 max-w-2xl mx-auto">
            {professionalInfo?.current_position} @ {professionalInfo?.current_company}
            {professionalInfo?.location && ` • ${professionalInfo.location}`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={handleDownloadCV}
            className="brutal-button"
          >
            DOWNLOAD CV
          </button>
          
          <a 
            href="#contact" 
            className="brutal-button-outline brutal-button"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            GET IN TOUCH
          </a>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="brutal-card">
            <div className="brutal-subtitle">{professionalInfo?.years_experience || 9}</div>
            <div className="brutal-text mt-1">ANNI DI ESPERIENZA</div>
          </div>
          <div className="brutal-card">
            <div className="brutal-subtitle">{professionalInfo?.team_size || 16}</div>
            <div className="brutal-text mt-1">TEAM SIZE</div>
          </div>
          <div className="brutal-card brutal-card-accent">
            <div className="brutal-subtitle">SME</div>
            <div className="brutal-text mt-1">PRACTICE LEADER</div>
          </div>
        </div>
      </div>
    </section>
  );
}