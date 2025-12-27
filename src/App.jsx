import React, { useState, useEffect } from 'react';
import Bio from './components/Bio';
import BooksSection from './components/BooksSection';
import FavoritesSection from './components/FavoritesSection';
import About from './components/About';
import Sidebar from './components/Sidebar';
import FloatingParticles from './components/FloatingParticles';

function App() {
  // Initialize from localStorage or URL hash, default to 'home'
  const getInitialPage = () => {
    // Check URL hash first
    const hash = window.location.hash.slice(1);
    if (hash && ['home', 'favorites', 'about'].includes(hash)) {
      return hash;
    }
    // Then check localStorage
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && ['home', 'favorites', 'about'].includes(savedPage)) {
      return savedPage;
    }
    return 'home';
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);

  // Update localStorage and URL hash when page changes
  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
    window.location.hash = currentPage;
  }, [currentPage]);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && ['home', 'favorites', 'about'].includes(hash)) {
        setCurrentPage(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <FloatingParticles />
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-12 transition-all duration-500 page-transition relative z-10">
        {currentPage === 'home' ? (
          <>
            <Bio />
            <BooksSection onNavigateToFavorites={() => setCurrentPage('favorites')} />
          </>
        ) : currentPage === 'favorites' ? (
          <FavoritesSection onNavigateBack={() => setCurrentPage('home')} />
        ) : (
          <About />
        )}
      </div>
    </div>
  );
}

export default App;
