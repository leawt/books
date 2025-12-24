import { useState } from 'react';
import Bio from './components/Bio';
import BookDisplay from './components/BookDisplay';
import booksData from './data/books.json';

function App() {
  const [selectedYear, setSelectedYear] = useState(null);

  // Get all unique years from books
  const years = [...new Set(booksData.books.map(book => book.year))].sort((a, b) => b - a);

  // Filter books by selected year
  const filteredBooks = selectedYear
    ? booksData.books.filter(book => book.year === selectedYear)
    : booksData.books;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white text-glow mb-4">
            My Reading Journey
          </h1>
          <p className="text-purple-200 text-lg">
            A collection of books I've read over the years
          </p>
        </header>

        <Bio />

        <div className="mt-16">
          <div className="flex justify-center mb-8">
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value) : null)}
              className="bg-purple-800/50 border-2 border-purple-500 rounded-lg px-6 py-3 text-white text-lg font-medium shadow-glow focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-purple-900"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <BookDisplay books={filteredBooks} selectedYear={selectedYear} />
        </div>
      </div>
    </div>
  );
}

export default App;

