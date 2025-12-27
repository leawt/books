#!/usr/bin/env python3
"""
Enhanced Book Cover Downloader with Multiple APIs
Downloads high-quality covers from Open Library, Google Books, and Internet Archive
Prioritizes most popular editions and validates image quality
"""

import json
import os
import time
import requests
from pathlib import Path
import urllib.parse
import re
from PIL import Image

def validate_image_quality(image_path, min_width=300, min_size_kb=20):
    """
    Validate that an image meets quality thresholds
    Returns True if image is valid, False otherwise
    """
    try:
        # Check file size
        file_size = os.path.getsize(image_path)
        if file_size < min_size_kb * 1024:
            return False
        
        # Check image dimensions
        with Image.open(image_path) as img:
            width, height = img.size
            if width < min_width or height < min_width:
                return False
        
        return True
    except Exception as e:
        print(f"      Quality validation error: {e}")
        return False

def download_from_url(url, output_path, validate_quality=True):
    """Download an image from a URL and optionally validate quality"""
    try:
        response = requests.get(url, timeout=10, stream=True)
        if response.status_code == 200:
            # Download to memory first
            content = response.content
            if len(content) < 1000:  # Too small, likely not a valid image
                return False
            
            # Write to file
            with open(output_path, 'wb') as f:
                f.write(content)
            
            # Validate quality if requested
            if validate_quality:
                if not validate_image_quality(output_path):
                    os.remove(output_path)
                    return False
            
            return True
    except Exception as e:
        print(f"      Error: {e}")
    return False

def get_cover_from_openlibrary_isbn(isbn, output_path):
    """
    Try to get cover from Open Library using ISBN
    Attempts to get higher resolution via API first, then falls back to covers endpoint
    """
    if not isbn:
        return False
    
    isbn_clean = isbn.replace('-', '').replace(' ', '')
    
    # First, try to get edition data from Open Library API to find higher quality covers
    try:
        api_url = f"https://openlibrary.org/isbn/{isbn_clean}.json"
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            edition_data = response.json()
            
            # Try to get cover from edition data (often higher quality)
            covers = edition_data.get('covers', [])
            if covers:
                # Try the first cover ID with large size
                cover_id = covers[0]
                # Open Library API provides access to original images
                # Try large size first
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                if download_from_url(cover_url, output_path, validate_quality=True):
                    return True
            
            # If we have a work key, try to get work covers (often better quality)
            works = edition_data.get('works', [])
            if works and len(works) > 0:
                work_key = works[0].get('key', '').replace('/works/', '')
                if work_key:
                    work_url = f"https://openlibrary.org/works/{work_key}.json"
                    work_response = requests.get(work_url, timeout=10)
                    if work_response.status_code == 200:
                        work_data = work_response.json()
                        work_covers = work_data.get('covers', [])
                        if work_covers:
                            cover_id = work_covers[0]
                            cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                            if download_from_url(cover_url, output_path, validate_quality=True):
                                return True
    except Exception as e:
        # If API fails, fall through to direct covers endpoint
        pass
    
    # Fallback to direct covers endpoint (standard method)
    url = f"https://covers.openlibrary.org/b/isbn/{isbn_clean}-L.jpg"
    if download_from_url(url, output_path, validate_quality=True):
        return True
    
    return False

def get_cover_from_google_books(title, author, output_path):
    """
    Try to get cover from Google Books API using title and author
    Uses first result (most popular edition) and ensures maximum quality
    """
    try:
        # Construct search query
        query = f"{title} {author}".strip()
        encoded_query = urllib.parse.quote(query)
        
        # Request first result (most popular edition)
        api_url = f"https://www.googleapis.com/books/v1/volumes?q={encoded_query}&maxResults=1"
        
        response = requests.get(api_url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if 'items' in data and len(data['items']) > 0:
                volume_info = data['items'][0].get('volumeInfo', {})
                image_links = volume_info.get('imageLinks', {})
                
                # Try to get the highest quality image available (prioritize extraLarge)
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
                    cover_url = cover_url.replace('&edge=curl', '').replace('?edge=curl', '')
                    # Remove other quality-reducing parameters while preserving important ones
                    # Remove zoom parameters that reduce quality
                    cover_url = re.sub(r'[?&]zoom=\d+', '', cover_url)
                    
                    if download_from_url(cover_url, output_path, validate_quality=True):
                        return True
        
    except Exception as e:
        print(f"      Google Books error: {e}")
    
    return False

def get_cover_from_internet_archive(title, author, isbn, output_path):
    """
    Try to get cover from Internet Archive
    Internet Archive often has high-quality book cover scans
    """
    try:
        # Try searching by ISBN first (most reliable)
        if isbn:
            isbn_clean = isbn.replace('-', '').replace(' ', '')
            # Internet Archive identifier format for books
            identifier = f"isbn_{isbn_clean}"
            
            # Try to get cover image
            cover_url = f"https://archive.org/services/img/{identifier}"
            if download_from_url(cover_url, output_path, validate_quality=True):
                return True
        
        # Try searching by title and author
        query = f"{title} {author}".strip()
        encoded_query = urllib.parse.quote(query)
        
        # Search Internet Archive
        search_url = f"https://archive.org/advancedsearch.php?q={encoded_query}&fl=identifier&output=json&rows=1"
        response = requests.get(search_url, timeout=10)
        
        if response.status_code == 200:
            try:
                data = response.json()
                if 'response' in data and 'docs' in data['response']:
                    docs = data['response']['docs']
                    if docs and len(docs) > 0:
                        identifier = docs[0].get('identifier', '')
                        if identifier:
                            cover_url = f"https://archive.org/services/img/{identifier}"
                            if download_from_url(cover_url, output_path, validate_quality=True):
                                return True
            except (json.JSONDecodeError, KeyError):
                pass
        
    except Exception as e:
        # Silently fail - Internet Archive is optional
        pass
    
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
        'openlibrary_success': 0,
        'google_success': 0,
        'internet_archive_success': 0,
        'skipped_no_data': 0,
        'failed': 0,
        'already_exists': 0,
        'quality_rejected': 0
    }
    
    # Process each year
    for year, year_data in books_data.items():
        books = year_data.get('books', [])
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
            
            success = False
            
            # Priority 1: Try Open Library (high-res via API if available, else covers endpoint)
            if isbn:
                print(f"      Trying Open Library (ISBN: {isbn})...")
                if get_cover_from_openlibrary_isbn(isbn, output_path):
                    print(f"      ✅ Success via Open Library!")
                    book['coverImage'] = f"/covers/{filename}"
                    stats['openlibrary_success'] += 1
                    success = True
                    time.sleep(0.5)
            
            # Priority 2: Try Google Books (extraLarge, first result = most popular)
            if not success:
                print(f"      Trying Google Books (most popular edition)...")
                if get_cover_from_google_books(title, author, output_path):
                    print(f"      ✅ Success via Google Books!")
                    book['coverImage'] = f"/covers/{filename}"
                    stats['google_success'] += 1
                    success = True
                    time.sleep(0.5)
            
            # Priority 3: Try Internet Archive (high-quality scans)
            if not success:
                print(f"      Trying Internet Archive...")
                if get_cover_from_internet_archive(title, author, isbn, output_path):
                    print(f"      ✅ Success via Internet Archive!")
                    book['coverImage'] = f"/covers/{filename}"
                    stats['internet_archive_success'] += 1
                    success = True
                    time.sleep(0.5)
            
            # Priority 4: Fallback to Open Library standard covers endpoint (if ISBN exists and we haven't tried it)
            if not success and isbn:
                print(f"      Trying Open Library fallback...")
                isbn_clean = isbn.replace('-', '').replace(' ', '')
                url = f"https://covers.openlibrary.org/b/isbn/{isbn_clean}-L.jpg"
                if download_from_url(url, output_path, validate_quality=False):  # Skip validation for fallback
                    print(f"      ✅ Success via Open Library fallback!")
                    book['coverImage'] = f"/covers/{filename}"
                    stats['openlibrary_success'] += 1
                    success = True
                    time.sleep(0.5)
            
            if not success:
                print(f"      ❌ No cover found (or quality too low)")
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
    print(f"Total books:                    {stats['total']}")
    print(f"✅ Already downloaded:           {stats['already_exists']}")
    print(f"✅ Open Library (high-res):      {stats['openlibrary_success']}")
    print(f"✅ Google Books (popular):       {stats['google_success']}")
    print(f"✅ Internet Archive (scans):     {stats['internet_archive_success']}")
    print(f"❌ No cover found:               {stats['failed']}")
    total_success = stats['openlibrary_success'] + stats['google_success'] + stats['internet_archive_success'] + stats['already_exists']
    print(f"\nSuccess rate: {(total_success / stats['total'] * 100):.1f}%")
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
        for year, year_data in books_data.items():
            books = year_data.get('books', [])
            for book in books:
                if not book.get('coverImage'):
                    print(f"   • {book['title']} by {book['author']} ({year})")

if __name__ == '__main__':
    main()
