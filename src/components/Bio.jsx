import React from 'react';

const Bio = () => {
  return (
    <div className="mb-12 sm:mb-16 text-center relative z-10">
      <div className="inline-block">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal mb-3 text-text-primary tracking-tight">
          My Reading Journey
        </h1>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-accent-purple/40 font-mono text-xs">✦</span>
          <div className="h-px w-24 sm:w-32 bg-accent-purple/40"></div>
          <span className="text-accent-purple/40 font-mono text-xs">✧</span>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4">
        <p className="text-base sm:text-lg text-text-primary/80 leading-relaxed mb-3 font-normal">
          Welcome to my reading journey. Books have always been my gateway to new worlds, 
          ideas, and perspectives. Here you'll find every book I've read from 2020 to 2025, 
          organized by year.
        </p>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed mb-4 font-normal">
          Each title represents a story, a lesson, or a moment in time. Hover over the book 
          covers to see the title and author, or tap on mobile devices.
        </p>
      </div>
    </div>
  );
};

export default Bio;
