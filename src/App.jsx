import React from 'react';
import Bio from './components/Bio';
import BooksSection from './components/BooksSection';

function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Bio />
        <BooksSection />
      </div>
    </div>
  );
}

export default App;
