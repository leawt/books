# Data Structure Guide

## Book Object Structure

Each book in `books.json` can include the following fields:

### Required Fields
- `id`: Unique identifier (e.g., "book-2025-1")
- `title`: Book title
- `author`: Author name
- `isbn`: ISBN number
- `coverImage`: Path to cover image (can be empty string)

### Optional Fields

#### For Favorites
- `tags`: Array of strings - Include `"favorites"` in this array to show in the all-time favorites shelf
- `favorite`: Boolean (legacy) - Set to `true` to include in favorites (also supported for backward compatibility)

#### For Analytics

**Timeline (Reading Dates)**
- `datesRead`: String - Reading date range in format "YYYY/MM/DD-YYYY/MM/DD" or single date "YYYY/MM/DD"
  - Can include multiple ranges separated by commas: "2025/08/24-2025/08/24, 2023/04/28-2023/05/03"
  - The system will automatically use the range matching the current year
- `startDate` / `finishDate`: ISO date strings (legacy format, also supported)

**Genre**
- `genre`: String - Single genre (e.g., "Fiction")
- `genres`: Array of strings - Multiple genres (e.g., ["Fiction", "Literary Fiction"])

Note: If both `genre` and `genres` are provided, `genres` takes precedence.

### Example Book Object

```json
{
  "id": "book-2025-1",
  "title": "Parade",
  "author": "Rachel Cusk",
  "isbn": "9780374610043",
  "coverImage": "/covers/9780374610043.jpg",
  "tags": ["favorites"],
  "datesRead": "2025/07/29-2025/08/07",
  "genres": ["Fiction", "Literary Fiction"],
  "format": "hardcover",
  "rating": 5.0,
  "readCount": 1
}
```

## Year Structure

Each year in `books.json` follows this structure:

```json
{
  "2025": {
    "books": [
      // Array of book objects
    ],
    "filters": {
      "honorable-mentions": ["book-2025-1", "book-2025-3"],
      "best-fiction": ["book-2025-2", "book-2025-4"]
    }
  }
}
```

### Filters

Filters are custom categories you create. Each filter is an object key with an array of book IDs that belong to that category.

- Filter keys use kebab-case (e.g., "honorable-mentions")
- Filter values are arrays of book IDs
- Filters are displayed as tabs in the Collections view

