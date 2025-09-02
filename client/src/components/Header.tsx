interface HeaderProps {
  onNavigate: (section: string) => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const handleScrollTo = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    onNavigate(sectionId);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b-2 border-black z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div 
            className="brutal-subtitle cursor-pointer"
            onClick={() => handleScrollTo('hero')}
          >
            SALVATORE
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <button 
              onClick={() => handleScrollTo('about')}
              className="brutal-link"
            >
              About
            </button>
            <button 
              onClick={() => handleScrollTo('skills')}
              className="brutal-link"
            >
              Skills
            </button>
            <button 
              onClick={() => handleScrollTo('projects')}
              className="brutal-link"
            >
              Projects
            </button>
            <button 
              onClick={() => handleScrollTo('contact')}
              className="brutal-link"
            >
              Contact
            </button>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden brutal-button">
            MENU
          </button>
        </div>
      </div>
    </header>
  );
}