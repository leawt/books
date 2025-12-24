#!/usr/bin/env python3
"""
Enhanced Book Cover Downloader with Multiple APIs
Downloads covers from Open Library (ISBN) and Google Books (title search) as fallback
"""

import json
import os
import time
import requests
from pathlib import Path
import urllib.parse

def download_from_url(url, output_path):
    """Download an image from a URL"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200 and len(response.content) > 1000:
            with open(output_path, 'wb') as f:
                f.write(response.content)
            return True
    except Exception as e:
        print(f"      Error: {e}")
    return False

def get_cover_from_openlibrary_isbn(isbn, output_path):
    """Try to get cover from Open Library using ISBN"""
    if not isbn:
        return False
    
    isbn_clean = isbn.replace('-', '').replace(' ', '')
    url = f"https://covers.openlibrary.org/b/isbn/{isbn_clean}-L.jpg"
    
    if download_from_url(url, output_path):
        return True
    return False

def get_cover_from_google_books(title, author, output_path):
    """Try to get cover from Google Books API using title and author"""
    try:
        # Construct search query
        query = f"{title} {author}".strip()
        encoded_query = urllib.parse.quote(query)
        
        api_url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
        
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                volume_info = data['items'][0].get('volumeInfo', {})
                image_links = volume_info.get('imageLinks', {})
                
                # Try to get the highest quality image available
                cover_url = (
                    image_links.get('extraLarge') or
                    image_links.get('large') or
                    image_links.get('medium') or
                    image_links.get('small') or
                    image_links.get('thumbnail')
                )
                
                if cover_url:
                    # Google Books uses HTTP, convert to HTTPS
                    cover_url = cover_url.replace('http://', 'https://')
                    # Remove edge=curl parameter for better quality
                    cover_url = cover_url.replace('&edge=curl', '')
                    
                    if download_from_url(cover_url, output_path):
                        return True
        
    except Exception as e:
        print(f"      Google Books error: {e}")
    
    return False

def sanitize_filename(text):
    """Create a safe filename from text"""
    # Remove or replace problematic characters
    safe = "".join(c for c in text if c.isalnum() or c in (' ', '-', '_'))
    return safe.strip()[:50]  # Limit length

def main():
    # Load the books data
    with open('src/data/books.json', 'r', encoding='utf-8') as f:
        books_data = json.load(f)
    
    # Create covers directory
    covers_dir = Path('public/covers')
    covers_dir.mkdir(exist_ok=True, parents=True)
    
    print("🎨 Starting enhanced book cover download...\n")
    
    stats = {
        'total': 0,
        'isbn_success': 0,
        'google_success': 0,
        'skipped_no_data': 0,
        'failed': 0,
        'already_exists': 0
    }
    
    # Process each year
    for year, books in books_data.items():
        print(f"📅 Processing {year} ({len(books)} books)...")
        
        for i, book in enumerate(books):
            stats['total'] += 1
            title = book['title']
            author = book['author']
            isbn = book.get('isbn', '')
            
            # Create a unique filename
            if isbn:
                filename = f"{isbn}.jpg"
            else:
                # Use title-author as filename if no ISBN
                safe_title = sanitize_filename(title)
                safe_author = sanitize_filename(author.split(',')[0])  # First author only
                filename = f"{safe_title}_{safe_author}.jpg"
            
            output_path = covers_dir / filename
            
            # Skip if already exists
            if output_path.exists():
                print(f"   {i+1}. ✓ '{title}' - already downloaded")
                book['coverImage'] = f"/covers/{filename}"
                stats['already_exists'] += 1
                continue
            
            print(f"   {i+1}. '{title}' by {author}")
            
            # Try Open Library first (if ISBN exists)
            if isbn:
                print(f"      Trying Open Library (ISBN: {isbn})...")
                if get_cover_from_openlibrary_isbn(isbn, output_path):
                    print(f"      ✅ Success via Open Library!")
                    book['coverImage'] = f"/covers/{filename}"
                    stats['isbn_success'] += 1
                    time.sleep(0.5)
                    continue
            
            # Fallback to Google Books (title search)
            print(f"      Trying Google Books (title search)...")
            if get_cover_from_google_books(title, author, output_path):
                print(f"      ✅ Success via Google Books!")
                book['coverImage'] = f"/covers/{filename}"
                stats['google_success'] += 1
            else:
                print(f"      ❌ No cover found")
                book['coverImage'] = ''
                stats['failed'] += 1
            
            # Rate limiting
            time.sleep(1)
        
        print()
    
    # Save updated JSON
    with open('src/data/books_with_covers.json', 'w', encoding='utf-8') as f:
        json.dump(books_data, f, indent=2, ensure_ascii=False)
    
    # Print summary
    print("=" * 70)
    print("📊 DOWNLOAD SUMMARY")
    print("=" * 70)
    print(f"Total books:              {stats['total']}")
    print(f"✅ Already downloaded:     {stats['already_exists']}")
    print(f"✅ Open Library (ISBN):    {stats['isbn_success']}")
    print(f"✅ Google Books (search):  {stats['google_success']}")
    print(f"❌ No cover found:         {stats['failed']}")
    print(f"\nSuccess rate: {((stats['isbn_success'] + stats['google_success'] + stats['already_exists']) / stats['total'] * 100):.1f}%")
    print(f"\n📁 Covers saved to: {covers_dir.absolute()}")
    print(f"📄 Updated JSON: books_with_covers.json")
    
    print("\n" + "=" * 70)
    print("💡 NEXT STEPS")
    print("=" * 70)
    print("1. Copy the 'covers' folder to your-project/public/covers/")
    print("2. Copy 'books_with_covers.json' to your-project/src/data/books.json")
    print("3. For books without covers, you can:")
    print("   • Search for covers manually on Amazon, Goodreads, etc.")
    print("   • Use a placeholder image")
    print("   • Run this script again later")
    
    # List books that failed
    if stats['failed'] > 0:
        print("\n📋 Books without covers:")
        for year, books in books_data.items():
            for book in books:
                if not book['coverImage']:
                    print(f"   • {book['title']} by {book['author']} ({year})")

if __name__ == '__main__':
    main()
