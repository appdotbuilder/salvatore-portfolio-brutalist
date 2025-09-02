export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t-2 border-black py-12 px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <div className="brutal-text">
            © {currentYear} <strong>SALVATORE</strong> - Senior Full Stack Developer
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a 
              href="https://linkedin.com/in/salvatore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="brutal-link"
              title="LinkedIn"
            >
              💼 LINKEDIN
            </a>
            
            <a 
              href="https://github.com/salvatore" 
              target="_blank" 
              rel="noopener noreferrer"
              className="brutal-link"
              title="GitHub"
            >
              🚀 GITHUB
            </a>
            
            <a 
              href="mailto:salvatore@example.com"
              className="brutal-link"
              title="Email"
            >
              📧 EMAIL
            </a>
          </div>
        </div>

        {/* Additional Footer Info */}
        <div className="mt-6 pt-6 border-t border-gray-300">
          <div className="brutal-text text-center text-gray-600 text-xs">
            <strong>MADE WITH:</strong> React • TypeScript • tRPC • TailwindCSS • Brutal Design Philosophy
          </div>
        </div>
      </div>
    </footer>
  );
}