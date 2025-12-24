import React from 'react';

const NowReading = () => {
  // You can make this dynamic later
  const currentBook = {
    title: "Parade",
    author: "Rachel Cusk",
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 bg-background/90 backdrop-blur-md border border-accent-purple/30 rounded-lg p-4 shadow-soft-lg max-w-[200px] animate-fadeIn">
      <div className="text-xs font-mono text-accent-purple/60 mb-1.5 tracking-wider">
        NOW READING
      </div>
      <div className="text-sm font-serif text-text-primary leading-tight">
        {currentBook.title}
      </div>
      <div className="text-xs font-light text-text-secondary mt-1">
        by {currentBook.author}
      </div>
      <div className="text-xs text-accent-purple/40 mt-2 font-mono">
        ✦ ✧ ✦
      </div>
    </div>
  );
};

export default NowReading;

