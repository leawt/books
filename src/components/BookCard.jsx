import { useState } from 'react';
import './BookCard.css';

function BookCard({ book }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="book-card-container"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={`book-card ${isFlipped ? 'flipped' : ''}`}
      >
        {/* Front of card - Book Cover */}
        <div className="book-card-front">
          <div className="book-card-inner">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="book-cover-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="book-cover-fallback">
              <div className="text-white text-center px-4">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-xs font-medium">No Cover</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back of card - Title & Author */}
        <div className="book-card-back">
          <div className="book-card-inner book-card-back-inner">
            <h3 className="text-white font-bold text-sm mb-2 leading-tight">
              {book.title}
            </h3>
            <p className="text-purple-200 text-xs mb-3">
              by {book.author}
            </p>
            {book.rating && (
              <div className="text-yellow-300 text-xs">
                {'⭐'.repeat(book.rating)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookCard;

