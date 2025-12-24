import React, { useState } from 'react';

const BookCard = ({ book }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="book-card-container perspective-1000 w-full max-w-[280px] mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)} // For mobile touch
    >
      <div 
        className={`book-card-inner relative w-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ 
          aspectRatio: '2/3',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front of card - Book Cover */}
        <div 
          className="book-face book-front absolute w-full h-full backface-hidden rounded-xl overflow-hidden
                     shadow-2xl shadow-purple-900/50 ring-2 ring-purple-500/20
                     hover:ring-purple-400/40 transition-all duration-300"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {book.coverImage ? (
            <>
              <img 
                src={book.coverImage} 
                alt={`Cover of ${book.title}`}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 hidden items-center justify-center flex-col text-center p-4">
                <div className="text-5xl mb-3">📚</div>
                <div className="text-white text-xs font-medium">{book.title}</div>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-700 via-indigo-800 to-purple-900 flex items-center justify-center flex-col text-center p-4">
              <div className="text-5xl mb-3">📚</div>
              <div className="text-white text-xs font-medium">{book.title}</div>
            </div>
          )}
          {/* Subtle overlay glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        {/* Back of card - Title & Author */}
        <div 
          className="book-face book-back absolute w-full h-full backface-hidden rounded-xl overflow-hidden
                     bg-gradient-to-br from-purple-900/90 via-slate-800/90 to-purple-950/90 backdrop-blur-sm
                     shadow-2xl shadow-purple-500/30 ring-2 ring-purple-400/30
                     flex flex-col items-center justify-center p-6 text-center"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          {/* Glowing background effect */}
          <div className="absolute inset-0 bg-purple-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-4 leading-tight">
              {book.title}
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-purple-400 to-transparent mx-auto mb-4 shadow-sm shadow-purple-400/50"></div>
            <p className="text-purple-200 text-sm font-medium">
              {book.author}
            </p>
          </div>

          {/* Corner decoration */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-purple-400/30 rounded-tr-lg"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-purple-400/30 rounded-bl-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
