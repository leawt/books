# My Reading Journey

A beautiful React reading website showcasing books I've read, organized by year. Features 3D flip card animations and a purple glowy aesthetic.

## Features

- 📚 Personal bio section
- 📅 Year-based book organization with dropdown selector
- 🎴 3D flip card animations (hover to reveal title/author)
- 💜 Purple glowy aesthetic design
- 📱 Responsive design

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Customization

### Update Your Bio

Edit `src/components/Bio.jsx` to customize your personal bio section.

### Add Your Books

1. Edit `src/data/books.json` to add your books
2. Each book should have:
   - `title`: Book title
   - `author`: Author name
   - `year`: Year read (number)
   - `coverImage`: Path to cover image (optional)
   - `rating`: Star rating 1-5 (optional)

### Add Book Cover Images

1. Create a `public/covers/` directory
2. Add your book cover images (JPG, PNG, etc.)
3. Reference them in `books.json` as `/covers/filename.jpg`

### Getting Book Cover Images

**Best Practices:**
- Use ISBN lookup services like Open Library API
- Search for high-resolution covers on Google Images (with usage rights)
- Use services like:
  - [Open Library](https://openlibrary.org/) - Free, open-source
  - [Google Books API](https://developers.google.com/books) - Free with API key
  - [ISBN Search](https://isbnsearch.org/) - Free lookup

**Example ISBN lookup:**
- Visit: https://openlibrary.org/isbn/[ISBN_NUMBER]
- Or use their API: `https://covers.openlibrary.org/b/isbn/[ISBN]-L.jpg`

## Deployment to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and configure the build
4. Your site will be live!

### Vercel Configuration

The project is already configured for Vercel. The build command is `npm run build` and the output directory is `dist`.

## Project Structure

```
books/
├── public/
│   └── covers/          # Book cover images
├── src/
│   ├── components/
│   │   ├── Bio.jsx      # Personal bio component
│   │   ├── BookCard.jsx # 3D flip card component
│   │   └── BookDisplay.jsx # Year-based book display
│   ├── data/
│   │   └── books.json   # Book data
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- CSS 3D Transforms

## License

MIT

