import React from 'react';
import Bio from './components/Bio';
import BooksSection from './components/BooksSection';
import Sidebar from './components/Sidebar';
import FloatingParticles from './components/FloatingParticles';
import CursorTrail from './components/CursorTrail';

function App() {
  return (
    <div className="min-h-screen bg-background relative">
      <CursorTrail />
      <FloatingParticles />
      <Sidebar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 ml-0 md:ml-0 transition-all duration-500 page-transition relative z-10">
        <Bio />
        <BooksSection />
      </div>
    </div>
  );
}

export default App;
