import BookCard from './BookCard';

function BookDisplay({ books, selectedYear }) {
  // Group books by year
  const booksByYear = books.reduce((acc, book) => {
    if (!acc[book.year]) {
      acc[book.year] = [];
    }
    acc[book.year].push(book);
    return acc;
  }, {});

  const sortedYears = Object.keys(booksByYear).sort((a, b) => b - a);

  return (
    <div className="space-y-12">
      {selectedYear ? (
        <div>
          <h2 className="text-3xl font-bold text-white text-glow mb-8 text-center">
            {selectedYear}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {booksByYear[selectedYear]?.map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </div>
      ) : (
        sortedYears.map(year => (
          <div key={year}>
            <h2 className="text-3xl font-bold text-white text-glow mb-8 text-center">
              {year}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {booksByYear[year].map((book, index) => (
                <BookCard key={index} book={book} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default BookDisplay;

