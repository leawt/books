import React from 'react';

const Bio = () => {
  return (
    <div className="mb-12 sm:mb-16 text-center relative z-10">
      <div className="inline-block">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal mb-3 text-text-primary tracking-tight">
          lea.earth
        </h1>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-accent-purple/40 font-mono text-xs">✦</span>
          <div className="h-px w-24 sm:w-32 bg-accent-purple/40"></div>
          <span className="text-accent-purple/40 font-mono text-xs">✧</span>
        </div>
        <p className="text-base sm:text-lg text-text-primary/80 leading-relaxed font-normal">
          cataloging books by year and data
        </p>
      </div>
    </div>
  );
};

export default Bio;
