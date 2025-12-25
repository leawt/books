import React from 'react';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal mb-3 text-text-primary tracking-tight">
          About Me
        </h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-accent-purple/40 font-mono text-xs">✦</span>
          <div className="h-px w-24 sm:w-32 bg-accent-purple/40"></div>
          <span className="text-accent-purple/40 font-mono text-xs">✧</span>
        </div>
      </div>

      <div className="space-y-6 text-base sm:text-lg text-text-primary/90 leading-relaxed">
        <p>
          My name is <span className="text-accent-purple/80 font-medium">Lea</span>. My last name is <span className="text-accent-purple/80 font-medium">Wang-Tomic</span> which is a hyphenation of my dad's surname Wang (王) and my mom's Tomic (Томић). I was born in Wilmington, Delaware but recall very little of it and lived most of my life in the San Gabriel Valley, an outer suburb of Los Angeles, with summers spent in Ohrid, Macedonia. I went to <a href="https://www.stanford.edu" target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:text-accent-purple-hover underline decoration-accent-purple/30 hover:decoration-accent-purple/60 transition-colors duration-300">Stanford University</a> and studied statistics and computer science but spent most of my time skipping class and reading books instead. As such I also left with a double minor in english and creative writing. I now live in Brooklyn, NY and work as a Product Marketer at <a href="https://www.pinecone.io" target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:text-accent-purple-hover underline decoration-accent-purple/30 hover:decoration-accent-purple/60 transition-colors duration-300">Pinecone</a>.
        </p>

        <p>
          I live with my brother, his partner, and our dog named <span className="text-accent-purple/80 font-medium">Noe</span>. I love Noe very much. I write, sometimes. I love to cook. I used to play the viola, and for a period of time in my teens I believed I wanted to be a professional musician. I then decided against that. I started playing ultimate frisbee in college. I still play ultimate frisbee. I love frisbee. I have a special tenderness for fungi and I am a dues paying member of the <a href="https://www.nymycologicalsociety.org" target="_blank" rel="noopener noreferrer" className="text-accent-purple hover:text-accent-purple-hover underline decoration-accent-purple/30 hover:decoration-accent-purple/60 transition-colors duration-300">New York Mycological Society</a>. In my free time, I like to read books.
        </p>

        <p className="pt-4 border-t border-accent-purple/20 italic text-text-secondary/90">
          Once, a friend characterized me as someone who is very intent on their inside being continuous with the space they inhabit. This is my attempt at syncing that with my virtual space.
        </p>
      </div>
    </div>
  );
};

export default About;

