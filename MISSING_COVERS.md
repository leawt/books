# Missing Book Covers 📚

## Summary

Out of 252 books, **248 covers were successfully downloaded** (98.4% success rate).

## Books Without Covers

The following 4 books need manual cover images:

### 2025
1. **A Certain Smile** by Françoise Sagan
   - ISBN: 9780140014440
   - Suggested: Search on Amazon or Goodreads for cover image

2. **A Game of Hide and Seek** by Elizabeth Taylor
   - ISBN: Not available in data
   - Suggested: Search by title and author on Google Books

### 2024
3. **A Room of One's Own** by Virginia Woolf
   - ISBN: Not available in data
   - Suggested: Classic book, should be easy to find on Goodreads

### 2022
4. **On Love** by Alain de Botton
   - ISBN: Not available in data
   - Suggested: Search on Amazon or publisher website

## How to Add Missing Covers

### Option 1: Manual Download

1. Search for the book on:
   - [Amazon](https://amazon.com)
   - [Goodreads](https://goodreads.com)
   - [Google Books](https://books.google.com)

2. Right-click the cover image and "Save Image As..."

3. Save to `public/covers/` with a descriptive filename:
   - Use ISBN if available: `9780140014440.jpg`
   - Or use title: `a-certain-smile.jpg`

4. Update `src/data/books.json`:
   ```json
   {
     "coverImage": "/covers/9780140014440.jpg"
   }
   ```

### Option 2: Re-run the Script

The enhanced download script might find covers on a second run:

```bash
python3 download_covers_enhanced.py
```

### Option 3: Use Online URLs

You can also use direct URLs from Open Library or Google Books:

```json
{
  "coverImage": "https://covers.openlibrary.org/b/isbn/9780140014440-L.jpg"
}
```

## Cover Sources

- **Open Library**: `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`
- **Google Books**: Search via API or manually find cover
- **Amazon**: High quality, but need to save manually
- **Goodreads**: Good quality, easy to find

## Notes

- The placeholder design (📚 icon with gradient background) will show for books without covers
- Books without covers still display properly with the fallback design
- You can add covers at any time - just update the JSON and refresh

