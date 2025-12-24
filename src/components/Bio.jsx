import React from 'react';

const Bio = () => {
  return (
    <div className="mb-16 text-center">
      <div className="inline-block">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-500 text-transparent bg-clip-text">
          My Reading Journey
        </h1>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-8 shadow-lg shadow-purple-500/50"></div>
      </div>
      
      <div className="max-w-2xl mx-auto">
        <p className="text-lg text-slate-300 leading-relaxed mb-4">
          Welcome to my reading journey. Books have always been my gateway to new worlds, 
          ideas, and perspectives. Here you'll find every book I've read from 2020 to 2025, 
          organized by year.
        </p>
        <p className="text-slate-400">
          Each title represents a story, a lesson, or a moment in time. Hover over the book 
          covers to see the title and author, or click on mobile devices.
        </p>
      </div>
    </div>
  );
};

export default Bio;
