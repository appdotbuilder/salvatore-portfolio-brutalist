import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { trpc } from '@/utils/trpc';

// Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Types
import type { 
  ProfessionalInfo, 
  Project, 
  Skill, 
  SkillCategory 
} from '../../server/src/schema';

function App() {
  // State management
  const [professionalInfo, setProfessionalInfo] = useState<ProfessionalInfo | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [, setCurrentSection] = useState('hero');
  const [isLoading, setIsLoading] = useState(true);

  // Data fetching functions
  const loadProfessionalInfo = useCallback(async () => {
    try {
      const result = await trpc.getProfessionalInfo.query();
      setProfessionalInfo(result);
    } catch (error) {
      console.error('Failed to load professional info:', error);
      // Set null if failed so the app can still continue
      setProfessionalInfo(null);
    }
  }, []);

  const loadProjects = useCallback(async () => {
    try {
      const result = await trpc.getProjects.query();
      setProjects(result);
    } catch (error) {
      console.error('Failed to load projects:', error);
      // Set empty array if failed so the app can still continue
      setProjects([]);
    }
  }, []);

  const loadSkills = useCallback(async () => {
    try {
      const result = await trpc.getSkills.query();
      setSkills(result.skills);
      setCategories(result.categories);
    } catch (error) {
      console.error('Failed to load skills:', error);
      // Set empty arrays if failed so the app can still continue
      setSkills([]);
      setCategories([]);
    }
  }, []);

  // Load all data on component mount
  const loadAllData = useCallback(async () => {
    setIsLoading(true);
    console.log('Starting data load...');
    try {
      await Promise.all([
        loadProfessionalInfo(),
        loadProjects(),
        loadSkills()
      ]);
      console.log('Data load completed successfully');
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  }, [loadProfessionalInfo, loadProjects, loadSkills]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // Navigation handler
  const handleNavigate = useCallback((section: string) => {
    setCurrentSection(section);
  }, []);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="brutal-title mb-4">LOADING...</div>
          <div className="w-16 h-1 bg-black mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Header */}
      <Header onNavigate={handleNavigate} />

      {/* Main Content - Improved centering and spacing */}
      <main className="w-full">
        {/* Hero Section */}
        <div className="w-full px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            <HeroSection 
              professionalInfo={professionalInfo}
            />
          </div>
        </div>

        {/* About Section */}
        <div className="w-full px-8 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <AboutSection 
              professionalInfo={professionalInfo}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="w-full px-8 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <SkillsSection 
              categories={categories}
              skills={skills}
            />
          </div>
        </div>

        {/* Projects Section */}
        <div className="w-full px-8 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <ProjectsSection 
              projects={projects}
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="w-full px-8 lg:px-12 py-16">
          <div className="max-w-7xl mx-auto">
            <ContactSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to top button */}
      <button
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          setCurrentSection('hero');
        }}
        className="fixed bottom-6 right-6 brutal-button z-40"
        title="Back to top"
      >
        ↑ TOP
      </button>
    </div>
  );
}

export default App;