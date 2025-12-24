# My Reading Journey 📚

A beautiful React reading website showcasing 252 books I've read from 2020-2025, with 3D flip card animations and a purple glowy aesthetic.

## ✨ Features

- 📚 **252 Books** organized by year (2020-2025)
- 🎴 **3D Flip Cards** - Hover to reveal title and author
- 🖼️ **248 Book Covers** automatically downloaded (98.4% success rate)
- 💜 **Purple Glowy Aesthetic** with gradient backgrounds
- 📱 **Fully Responsive** design
- 🎯 **Year Selector** dropdown to filter by year

## 🚀 Getting Started

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

3. Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
reading-website/
├── public/
│   └── covers/          # 248 book cover images
├── src/
│   ├── components/
│   │   ├── Bio.jsx      # Personal bio section
│   │   ├── BookCard.jsx # 3D flip card component
│   │   ├── BooksSection.jsx # Year selector and display
│   │   └── YearSection.jsx  # Books grid for a year
│   ├── data/
│   │   └── books.json   # Book data (252 books)
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── vercel.json          # Vercel deployment config
```

## 🎨 Customization

### Update Your Bio

Edit `src/components/Bio.jsx` to customize your personal information:

```jsx
<h1 className="...">
  Your Name Here  {/* Change this */}
</h1>
<p className="...">
  Your personal bio text here...
</p>
```

### Add More Books

Edit `src/data/books.json` to add new books. The format is:

```json
{
  "2025": [
    {
      "id": "book-2025-1",
      "title": "Book Title",
      "author": "Author Name",
      "isbn": "9780123456789",
      "coverImage": "/covers/9780123456789.jpg"
    }
  ]
}
```

### Add Missing Book Covers

4 books are currently missing covers:
1. **A Certain Smile** by Françoise Sagan (2025)
2. **A Game of Hide and Seek** by Elizabeth Taylor (2025)
3. **A Room of One's Own** by Virginia Woolf (2024)
4. **On Love** by Alain de Botton (2022)

To add covers manually:
1. Find the cover image online (Amazon, Goodreads, etc.)
2. Save it as a JPG in `public/covers/`
3. Name it using the ISBN (e.g., `9780140014440.jpg`) or a descriptive name
4. Update the `coverImage` field in `books.json`

Or use the Python script again:
```bash
python3 download_covers_enhanced.py
```

## 🚀 Deployment to Vercel

### Step 1: Push to GitHub

1. Create a new repository on GitHub (or use existing)
2. Add the remote:
```bash
git remote add origin https://github.com/yourusername/reading-website.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite settings
5. Click "Deploy"

The `vercel.json` file is already configured, so Vercel will:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: Vite

Your site will be live with a URL like `https://reading-website-xxx.vercel.app`

## 📊 Statistics

- **Total Books**: 252
- **Books with Covers**: 248 (98.4%)
- **Books without Covers**: 4
- **Years Covered**: 2020-2025
- **Books per Year**:
  - 2025: 45 books
  - 2024: 50 books
  - 2023: 44 books
  - 2022: 38 books
  - 2021: 44 books
  - 2020: 31 books

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **CSS 3D Transforms** - Flip card animations

## 📝 License

MIT

---

**Happy reading! 📖✨**

