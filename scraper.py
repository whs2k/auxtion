import os
import sys
import subprocess

def main():
    ebay_key = sys.argv[1] if len(sys.argv) > 1 else ""
    
    print("Starting Auxtion Scraper Pipeline...")
    
    # Run the new scrapers
    subprocess.run(["python3", "scrapers.py", ebay_key])
    
    print("Scraping complete.")

if __name__ == "__main__":
    main()