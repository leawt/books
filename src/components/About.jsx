import React from 'react';
import WordWithPhoto from './WordWithPhoto';

const About = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal mb-3 text-text-primary tracking-tight">
          about me
        </h1>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-accent-purple/40 font-mono text-xs">✦</span>
          <div className="h-px w-24 sm:w-32 bg-accent-purple/40"></div>
          <span className="text-accent-purple/40 font-mono text-xs">✧</span>
        </div>
      </div>

      <div className="space-y-6 text-base sm:text-lg text-text-primary/90 leading-relaxed">
        <p>
          My name is Lea. My last name is Wang-Tomic which is a hyphenation of my dad's surname Wang (王) and my mom's Tomic (Томић). I was born in Wilmington, Delaware but recall very little of it and lived most of my life in the San Gabriel Valley, an outer suburb of Los Angeles, with summers spent in <WordWithPhoto word="Ohrid" photoPath="/photos/ohrid.jpg" />, Macedonia. I went to Stanford University and studied statistics and computer science but spent most of my time skipping class and reading books instead. As such I also left with a double minor in english and creative writing. I now live in Brooklyn, NY and work as a Product Marketer at <a href="https://www.pinecone.io" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-accent-blue-hover underline decoration-accent-blue/30 hover:decoration-accent-blue/60 transition-colors duration-300">Pinecone</a>.
        </p>

        <p>
          I live with my brother, his partner, and our dog named <WordWithPhoto word="Noe" photoPath="/photos/noe(1).jpg" />. I love <WordWithPhoto word="Noe" photoPath="/photos/noe(2).jpg" /> very much. <a href="https://consumptionchronicles.substack.com/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-accent-blue-hover underline decoration-accent-blue/30 hover:decoration-accent-blue/60 transition-colors duration-300">I write</a>, sometimes. I love to <WordWithPhoto word="cook" photoPath="/photos/cook.jpg" />. I used to play the viola, and for a period of time in my teens I believed I wanted to be a professional musician. I then decided against that. I started playing ultimate frisbee in college. I still play ultimate frisbee. I love frisbee. I have a special tenderness for <WordWithPhoto word="fungi" photoPath="/photos/fungi.jpg" /> and I am a dues paying member of the <a href="https://www.newyorkmyc.org/" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-accent-blue-hover underline decoration-accent-blue/30 hover:decoration-accent-blue/60 transition-colors duration-300">New York Mycological Society</a>. In my free time, I like to <a href="#home" className="text-accent-blue hover:text-accent-blue-hover underline decoration-accent-blue/30 hover:decoration-accent-blue/60 transition-colors duration-300">read</a> books.
        </p>

      </div>
    </div>
  );
};

export default About;

