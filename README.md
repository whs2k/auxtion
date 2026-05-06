# Auxtion Marketplace 🏛️

A premium, luxury auction sales aggregator built with Python (scraping) and Vanilla JS/CSS (frontend). Hosted on GitHub Pages with automated data updates via GitHub Actions.

## Features
- **Luxury Dark Aesthetic**: Glassmorphism, gold accents, and premium typography.
- **Multi-House Aggregation**: Scrapes Christie's, Sotheby's, Phillips, StockX, and eBay.
- **Dynamic Dashboard**: Client-side filtering, searching, and sorting.
- **Automated Pipeline**: Daily scraping runs via GitHub Actions to keep data fresh.

## Tech Stack
- **Frontend**: HTML5, Vanilla CSS3, Javascript (ES6+)
- **Backend**: Python 3.9+, BeautifulSoup4, Requests, GitHub Actions
- **Data**: JSON-based flat file storage (sales.json)

## Setup Locally
1. Clone the repo: `git clone https://github.com/whs2k/auxtion.git`
2. Install dependencies: `pip install -r requirements.txt`
3. Run the scraper: `python3 scraper.py`
4. Open `index.html` in your browser.

## Contributing
Scrapers are located in `scrapers.py`. Each house has a dedicated function. To add a new house, implement a `scrape_HOUSE()` function and add it to the main execution block.

---
Built with ❤️ for luxury collectors.