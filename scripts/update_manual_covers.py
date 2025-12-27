#!/usr/bin/env python3
"""
Helper script to update books.json after manually adding cover images
Run this after you've added cover images to public/covers/
"""

import json
import os
from pathlib import Path

def update_cover_paths():
    """Update books.json with cover paths for manually added images"""
    
    # Load books data
    with open('../src/data/books.json', 'r', encoding='utf-8') as f:
        books_data = json.load(f)
    
    covers_dir = Path('../public/covers')
    updated_count = 0
    missing_files = []
    
    print("🔍 Checking for manually added covers...\n")
    
    # Process each year
    for year, year_data in books_data.items():
        books = year_data.get('books', [])
        
        for book in books:
            title = book['title']
            author = book['author']
            isbn = book.get('isbn', '')
            
            # Determine expected filename (same logic as download script)
            if isbn:
                filename = f"{isbn}.jpg"
            else:
                # Use title-author format (same as download script)
                def sanitize_filename(text):
                    safe = "".join(c for c in text if c.isalnum() or c in (' ', '-', '_'))
                    return safe.strip()[:50]
                
                safe_title = sanitize_filename(title)
                safe_author = sanitize_filename(author.split(',')[0])  # First author only
                filename = f"{safe_title}_{safe_author}.jpg"
            
            cover_path = covers_dir / filename
            
            # Check if cover exists but not in JSON, or if user wants to update
            if cover_path.exists():
                current_cover = book.get('coverImage', '')
                expected_path = f"/covers/{filename}"
                
                if current_cover != expected_path:
                    book['coverImage'] = expected_path
                    updated_count += 1
                    print(f"✅ Updated: {title} by {author}")
                    print(f"   File: {filename}")
            else:
                # Check if there's a cover path but file doesn't exist
                if book.get('coverImage') and not (covers_dir / book['coverImage'].replace('/covers/', '')).exists():
                    missing_files.append((title, author, book['coverImage']))
    
    # Save updated JSON
    if updated_count > 0:
        with open('../src/data/books.json', 'w', encoding='utf-8') as f:
            json.dump(books_data, f, indent=2, ensure_ascii=False)
        
        print(f"\n✨ Updated {updated_count} book(s) with cover images!")
        print(f"📄 Saved to: ../src/data/books.json")
    else:
        print("ℹ️  No updates needed. All covers are already linked correctly.")
    
    # List missing files
    if missing_files:
        print(f"\n⚠️  Found {len(missing_files)} cover(s) referenced in JSON but missing from filesystem:")
        for title, author, path in missing_files[:10]:
            print(f"   • {title} by {author}")
            print(f"     Expected: {path}")

if __name__ == '__main__':
    update_cover_paths()

