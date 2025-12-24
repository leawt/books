import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Empty for now - space for future "About" links and other content
  const links = [];

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 p-2 text-accent-purple hover:text-accent-purple-hover transition-colors duration-300"
        aria-label="Toggle sidebar"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full w-56 sm:w-64 bg-background/85 backdrop-blur-md border-r border-accent-purple/30 shadow-soft-lg">
          <div className="p-6 pt-16">
            <nav className="space-y-1">
              {links.length > 0 ? (
                links.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="group flex items-center gap-3 px-4 py-2.5 text-sm font-light text-text-primary hover:text-accent-purple-hover transition-all duration-300 hover:bg-accent-purple/10 rounded-md relative overflow-hidden"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow = '0 0 8px rgba(139, 123, 168, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = 'none';
                    }}
                  >
                    <span className="text-accent-purple/60 group-hover:text-accent-purple transition-colors duration-300">
                      {link.icon}
                    </span>
                    <span className="font-serif">{link.label}</span>
                    <div className="absolute inset-0 bg-accent-purple/0 group-hover:bg-accent-purple/5 transition-colors duration-300 rounded-md"></div>
                  </a>
                ))
              ) : (
                <div className="text-xs text-text-secondary/40 font-mono text-center py-8">
                  <div className="mb-2">･ﾟ･｡･ﾟﾟ･</div>
                  <div className="text-xs text-text-secondary/30 font-serif italic">
                    Space for future links
                  </div>
                </div>
              )}
            </nav>
            
            {/* Decorative divider */}
            <div className="mt-8 pt-8 border-t border-accent-purple/20">
              <div className="text-xs text-text-secondary/60 font-mono text-center">
                ･ﾟ･｡･ﾟﾟ･
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

