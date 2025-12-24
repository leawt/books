import React from 'react';
import Bio from './components/Bio';
import BooksSection from './components/BooksSection';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Bio />
        <BooksSection />
      </div>
    </div>
  );
}

export default App;
