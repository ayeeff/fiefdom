import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time
from datetime import datetime

# Configuration
BASE_URL = "https://www.marketcapwatch.com/united-states/largest-companies-in-united-states/"
PUBLIC_CSV = "data/public.csv"
OUTPUT_CSV = "data/pubtotal.csv"

def setup_driver():
    """Setup headless Chrome driver"""
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36')
    
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def parse_market_cap(value):
    """Parse market cap string to numeric value"""
    if pd.isna(value) or value == '' or value == '-':
        return 0
    value = str(value).replace('$', '').replace(',', '').replace(' ', '').strip()
    multiplier = 1
    if 'T' in value.upper():
        multiplier = 1_000_000_000_000
        value = value.upper().replace('T', '').strip()
    elif 'B' in value.upper():
        multiplier = 1_000_000_000
        value = value.upper().replace('B', '').strip()
    elif 'M' in value.upper():
        multiplier = 1_000_000
        value = value.upper().replace('M', '').strip()
    try:
        return float(value) * multiplier
    except (ValueError, AttributeError):
        return 0

def normalize_ticker(ticker):
    """Normalize ticker symbol for matching"""
    if pd.isna(ticker):
        return ""
    return str(ticker).strip().upper()

def extract_ticker_from_row(row):
    """Extract ticker from a table row"""
    try:
        cells = row.find_elements(By.TAG_NAME, "td")
        if len(cells) >= 2:
            company_cell = cells[1]
            p_tags = company_cell.find_elements(By.TAG_NAME, "p")
            for p in p_tags:
                text = p.text.strip()
                # Handle tickers with prefixes like OTC-, NYSE-, etc.
                # Match pattern: all uppercase, may contain hyphens, 2-10 chars
                if text and 2 <= len(text) <= 10 and text.replace('-', '').isupper():
                    return normalize_ticker(text)
    except Exception:
        pass
    return None

def scrape_all_pages(driver, target_tickers):
    """Scrape all pages until we find all target tickers or run out of pages"""
    print(f"\nTarget tickers to find: {len(target_tickers)}")
    print("Tickers:", ', '.join(sorted(target_tickers.keys())))
    
    found_companies = {}
    page = 1
    max_pages = 50
    
    normalized_targets = {normalize_ticker(ticker): ticker for ticker in target_tickers.keys()}
    
    while page <= max_pages and len(found_companies) < len(target_tickers):
        url = BASE_URL if page == 1 else f"{BASE_URL}?pn={page}"
        print(f"\nScraping page {page}: {url}")
        
        try:
            driver.get(url)
            time.sleep(3)
            
            tables = driver.find_elements(By.TAG_NAME, "table")
            if not tables:
                print(f"  ⚠️ No table found on page {page}, stopping")
                break
            
            table = tables[0]
            rows = table.find_elements(By.TAG_NAME, "tr")
            
            companies_on_page = 0
            for row in rows[1:]:
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 3:
                    try:
                        rank = cells[0].text.strip()
                        company_name = cells[1].text.strip()
                        market_cap = cells[2].text.strip()
                        ticker = extract_ticker_from_row(row)
                        
                        if ticker and ticker in normalized_targets:
                            original_ticker = normalized_targets[ticker]
                            if original_ticker not in found_companies:
                                company_info = target_tickers[original_ticker]
                                found_companies[original_ticker] = {
                                    'Company': company_info['Company'],
                                    'Ticker': original_ticker,
                                    'Full Name': company_name,
                                    'Market Cap': market_cap,
                                    'Market Cap Numeric': parse_market_cap(market_cap),
                                    'Rank': rank
                                }
                                print(f"  ✓ Found: {original_ticker} - {company_info['Company']} ({company_name}) - {market_cap} (Rank: {rank})")
                        
                        companies_on_page += 1
                    except Exception as e:
                        print(f"  ⚠️ Error parsing row: {e}")
            
            print(f"  Processed {companies_on_page} companies on page {page}")
            print(f"  Progress: {len(found_companies)}/{len(target_tickers)} tickers found")
            
            if companies_on_page == 0:
                print(f"  No companies found on page {page}, stopping")
                break
            
            page += 1
            time.sleep(2)
            
        except Exception as e:
            print(f"  ❌ Error scraping page {page}: {e}")
            break
    
    missing = set(target_tickers.keys()) - set(found_companies.keys())
    if missing:
        print(f"\n⚠️ Could not find {len(missing)} tickers:")
        for ticker in sorted(missing):
            company_info = target_tickers[ticker]
            print(f"  - {ticker} ({company_info['Company']})")
    
    return found_companies

def main():
    print("="*80)
    print("PUBLIC COMPANIES MARKET CAP SCRAPER")
    print("="*80)
    
    os.makedirs('data', exist_ok=True)
    
    if not os.path.exists(PUBLIC_CSV):
        print(f"❌ Error: {PUBLIC_CSV} not found!")
        return
    
    df_public = pd.read_csv(PUBLIC_CSV)
    print(f"\n✓ Loaded {len(df_public)} companies from {PUBLIC_CSV}")
    
    target_tickers = {}
    for _, row in df_public.iterrows():
        ticker = normalize_ticker(row['Ticker'])
        if ticker:
            target_tickers[ticker] = {
                'Company': row['Company'],
                'Ticker': row['Ticker']
            }
    
    driver = setup_driver()
    today = datetime.utcnow().strftime('%Y-%m-%d')
    
    try:
        found_companies = scrape_all_pages(driver, target_tickers)
        
        if not found_companies:
            print("\n❌ No companies found!")
            return
        
        df_output = pd.DataFrame(found_companies.values())
        df_output['Date'] = today
        df_output = df_output[['Company', 'Ticker', 'Full Name', 'Market Cap', 'Market Cap Numeric', 'Rank', 'Date']]
        df_output = df_output.sort_values('Market Cap Numeric', ascending=False)
        
        # Save with overwrite
        df_output.to_csv(OUTPUT_CSV, index=False, mode='w')
        print(f"\n✓ Saved {len(df_output)} companies to {OUTPUT_CSV}")
        
        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        total_market_cap = df_output['Market Cap Numeric'].sum()
        print(f"Total Market Cap: ${total_market_cap / 1_000_000_000_000:.2f}T")
        print(f"\nTop 5 by Market Cap:")
        for idx, row in df_output.head().iterrows():
            print(f"  {row['Rank']}. {row['Company']} ({row['Ticker']}): {row['Market Cap']}")
        
        print("\n" + "="*80)
        print("✅ SCRAPING COMPLETED SUCCESSFULLY!")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        raise
    finally:
        driver.quit()
        print("\n✓ Driver closed")

if __name__ == "__main__":
    main()
