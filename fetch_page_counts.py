#!/usr/bin/env python3
"""
Fetch missing pageCount values from Google Books API using ISBNs
"""

import json
import time
import requests
from pathlib import Path

def get_page_count_from_google_books(isbn, title, author):
    """
    Try to get pageCount from Google Books API using ISBN
    Falls back to title/author search if ISBN search fails
    """
    if not isbn:
        return None
    
    try:
        # Try ISBN search first (most reliable)
        isbn_clean = isbn.replace('-', '').replace(' ', '')
        api_url = f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn_clean}&maxResults=1"
        
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                volume_info = data['items'][0].get('volumeInfo', {})
                page_count = volume_info.get('pageCount')
                
                if page_count and isinstance(page_count, int) and page_count > 0:
                    return page_count
        
        # Fallback to title/author search
        if title and author:
            query = f"{title} {author}".strip()
            encoded_query = requests.utils.quote(query)
            api_url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
            
            response = requests.get(api_url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'items' in data and len(data['items']) > 0:
                    volume_info = data['items'][0].get('volumeInfo', {})
                    page_count = volume_info.get('pageCount')
                    
                    if page_count and isinstance(page_count, int) and page_count > 0:
                        return page_count
        
    except Exception as e:
        print(f"      Error fetching pageCount: {e}")
    
    return None

def main():
    # Load the books data
    books_file = Path('src/data/books.json')
    with open(books_file, 'r', encoding='utf-8') as f:
        books_data = json.load(f)
    
    print("📚 Starting pageCount fetch for missing values...\n")
    
    stats = {
        'total_checked': 0,
        'found': 0,
        'not_found': 0,
        'already_has': 0
    }
    
    # Process each year
    for year, year_data in books_data.items():
        books = year_data.get('books', [])
        print(f"📅 Processing {year} ({len(books)} books)...")
        
        for i, book in enumerate(books):
            title = book.get('title', '')
            author = book.get('author', '')
            isbn = book.get('isbn', '')
            current_page_count = book.get('pageCount')
            
            # Skip if already has pageCount
            if current_page_count and isinstance(current_page_count, int) and current_page_count > 0:
                stats['already_has'] += 1
                continue
            
            stats['total_checked'] += 1
            print(f"   {i+1}. '{title}' by {author}")
            
            if not isbn:
                print(f"      ⚠️  No ISBN, skipping")
                stats['not_found'] += 1
                continue
            
            print(f"      Searching for pageCount (ISBN: {isbn})...")
            page_count = get_page_count_from_google_books(isbn, title, author)
            
            if page_count:
                book['pageCount'] = page_count
                print(f"      ✅ Found: {page_count} pages")
                stats['found'] += 1
            else:
                print(f"      ❌ Not found")
                stats['not_found'] += 1
            
            # Rate limiting
            time.sleep(0.5)
        
        print()
    
    # Save updated JSON
    with open(books_file, 'w', encoding='utf-8') as f:
        json.dump(books_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("=" * 70)
    print("📊 SUMMARY")
    print("=" * 70)
    print(f"Total books checked:           {stats['total_checked']}")
    print(f"✅ Already had pageCount:      {stats['already_has']}")
    print(f"✅ Found and added:            {stats['found']}")
    print(f"❌ Not found:                  {stats['not_found']}")
    print(f"\n📄 Updated: {books_file.absolute()}")

if __name__ == '__main__':
    main()

