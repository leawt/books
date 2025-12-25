import React, { useState } from 'react';

const Sidebar = ({ currentPage, setCurrentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    {
      label: 'Home',
      href: '#',
      page: 'home',
      icon: '⌂',
    },
    {
      label: 'About',
      href: '#',
      page: 'about',
      icon: '◊',
    },
  ];

  const handleLinkClick = (e, page) => {
    e.preventDefault();
    setCurrentPage(page);
  };

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
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.page)}
                  className={`group flex items-center gap-3 px-4 py-2.5 text-sm font-light transition-all duration-300 hover:bg-accent-purple/10 rounded-md relative overflow-hidden ${
                    currentPage === link.page
                      ? 'text-accent-purple-hover bg-accent-purple/10'
                      : 'text-text-primary hover:text-accent-purple-hover'
                  }`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.textShadow = '0 0 8px rgba(139, 123, 168, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.textShadow = 'none';
                  }}
                >
                  <span className={`transition-colors duration-300 ${
                    currentPage === link.page
                      ? 'text-accent-purple'
                      : 'text-accent-purple/60 group-hover:text-accent-purple'
                  }`}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                  <div className="absolute inset-0 bg-accent-purple/0 group-hover:bg-accent-purple/5 transition-colors duration-300 rounded-md"></div>
                </a>
              ))}
            </nav>
            
            {/* Decorative divider */}
            <div className="mt-8 pt-8 border-t border-accent-purple/20">
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

