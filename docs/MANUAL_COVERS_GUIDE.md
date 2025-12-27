# Manual Cover Image Guide

## How to Manually Add or Replace Book Covers

### Step 1: Find Your Cover Image

Download a high-quality cover image from:
- **Amazon** - Right-click cover image → "Save Image As..."
- **Goodreads** - Click on book cover → Right-click → "Save Image As..."
- **Google Books** - Search for the book → Right-click cover → "Save Image As..."
- **Publisher websites** - Often have high-res promotional images

**Recommended:** Aim for at least 500x750px (or higher) for best quality.

### Step 2: Name Your File Correctly

The filename depends on whether the book has an ISBN:

#### If the book HAS an ISBN:
- Use the ISBN as the filename: `{ISBN}.jpg`
- Example: `9780374610043.jpg`

#### If the book does NOT have an ISBN:
- Use format: `{Title}_{Author}.jpg`
- Remove special characters, keep only letters, numbers, spaces, hyphens, underscores
- Limit to 50 characters per part
- Example: `White_Teeth_Zadie Smith.jpg`

### Step 3: Save to Covers Folder

1. Save your image file to: `public/covers/`
2. Make sure it's a `.jpg` file (convert from PNG if needed)

### Step 4: Update the JSON

After adding your cover images, run the helper script:

```bash
python3 scripts/update_manual_covers.py
```

This script will:
- ✅ Automatically detect new cover images you added
- ✅ Update `books.json` with the correct cover paths
- ✅ Show you which books were updated

### Step 5: Replace Existing Covers

To replace an existing cover:
1. **Delete the old cover** from `public/covers/` (or just overwrite it)
2. **Add your new cover** with the same filename
3. Run `scripts/update_manual_covers.py` to verify the path is correct

---

## Books Currently Missing Covers

Here are the 15 books that need covers:

1. **Saturday** by Margaret Ross (ISBN: 9798987828878) - Year: 2025
2. **Bonjour Tristesse** by Françoise Sagan (ISBN: 9780141032917) - Year: 2025
3. **The Ten Year Affair** by Erin Somers (ISBN: 9781668081440) - Year: 2025
4. **Dunce** by Mary Ruefle (ISBN: 9781940696850) - Year: 2025
5. **A Game of Hide and Seek** by Elizabeth Taylor (ISBN: 9781590174968) - Year: 2025
6. **The Book** by Mary Ruefle (ISBN: 9781950268849) - Year: 2024
7. **Difficult Loves and Other Stories** by Italo Calvino (ISBN: N/A) - Year: 2024
8. **Underground Barbie** by Maša Kolanović (ISBN: 9789533515120) - Year: 2024
9. **Earth Room** by Rachel Mannheimer (ISBN: 9781955125109) - Year: 2024
10. **The Goodbye People** by Gavin Lambert (ISBN: N/A) - Year: 2023
11. **All of It Singing: New and Selected Poems** by Linda Gregg (ISBN: 9781555975074) - Year: 2023
12. **Less** by Andrew Sean Greer (ISBN: N/A) - Year: 2021
13. **White Teeth** by Zadie Smith (ISBN: N/A) - Year: 2020
14. **Pachinko** by Min Jin Lee (ISBN: 9786064305336) - Year: 2020
15. **The Brief and Wondrous Life of Oscar Wao** by Junot Díaz (ISBN: N/A) - Year: 2020

---

## Quick Reference

**File location:** `public/covers/`

**Naming convention:**
- With ISBN: `{ISBN}.jpg`
- Without ISBN: `{Title}_{Author}.jpg`

**Update script:** `python3 scripts/update_manual_covers.py`

**Verify:** After running the script, check your website to see the new covers!

