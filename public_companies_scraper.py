import os
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from github import Github, Auth
import time
from datetime import datetime
import re

# Configuration
BASE_URL = "https://www.marketcapwatch.com/united-states/largest-companies-in-united-states/"
REPO_NAME = "ayeeff/marketcap"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
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

def normalize_company_name(name):
    """Normalize company name for matching"""
    # Remove common suffixes and punctuation
    name = re.sub(r'\s+(Inc\.?|Corp\.?|Corporation|Ltd\.?|Limited|LLC|L\.P\.|LP)\s*$', '', name, flags=re.IGNORECASE)
    # Remove special characters and extra spaces
    name = re.sub(r'[^\w\s]', '', name)
    name = re.sub(r'\s+', ' ', name).strip().lower()
    return name

def scrape_all_pages(driver, target_companies):
    """Scrape all pages until we find all target companies or run out of pages"""
    print(f"\nTarget companies to find: {len(target_companies)}")
    print("Companies:", ', '.join(target_companies.keys()))
    
    found_companies = {}
    page = 1
    max_pages = 50  # Safety limit
    
    # Normalize target company names for matching
    normalized_targets = {normalize_company_name(name): name for name in target_companies.keys()}
    
    while page <= max_pages and len(found_companies) < len(target_companies):
        if page == 1:
            url = BASE_URL
        else:
            url = f"{BASE_URL}?pn={page}"
        
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
            for row in rows[1:]:  # Skip header
                cells = row.find_elements(By.TAG_NAME, "td")
                if len(cells) >= 3:
                    try:
                        rank = cells[0].text.strip()
                        company_name = cells[1].text.strip()
                        market_cap = cells[2].text.strip()
                        
                        # Normalize the scraped company name
                        normalized_name = normalize_company_name(company_name)
                        
                        # Check if this company matches any target
                        if normalized_name in normalized_targets:
                            original_name = normalized_targets[normalized_name]
                            if original_name not in found_companies:
                                found_companies[original_name] = {
                                    'Company': original_name,
                                    'Ticker': target_companies[original_name],
                                    'Full Name': company_name,
                                    'Market Cap': market_cap,
                                    'Market Cap Numeric': parse_market_cap(market_cap),
                                    'Rank': rank
                                }
                                print(f"  ✓ Found: {original_name} ({company_name}) - {market_cap} (Rank: {rank})")
                        
                        companies_on_page += 1
                    except Exception as e:
                        print(f"  ⚠️ Error parsing row: {e}")
            
            print(f"  Processed {companies_on_page} companies on page {page}")
            print(f"  Progress: {len(found_companies)}/{len(target_companies)} companies found")
            
            # Check if there's a next page
            if companies_on_page == 0:
                print(f"  No companies found on page {page}, stopping")
                break
            
            page += 1
            time.sleep(2)  # Be nice to the server
            
        except Exception as e:
            print(f"  ❌ Error scraping page {page}: {e}")
            break
    
    # Report missing companies
    missing = set(target_companies.keys()) - set(found_companies.keys())
    if missing:
        print(f"\n⚠️ Could not find {len(missing)} companies:")
        for company in missing:
            print(f"  - {company}")
    
    return found_companies

def main():
    print("="*80)
    print("PUBLIC COMPANIES MARKET CAP SCRAPER")
    print("="*80)
    
    # Ensure data directory exists
    os.makedirs('data', exist_ok=True)
    
    # Load target companies
    if not os.path.exists(PUBLIC_CSV):
        print(f"❌ Error: {PUBLIC_CSV} not found!")
        return
    
    df_public = pd.read_csv(PUBLIC_CSV)
    print(f"\n✓ Loaded {len(df_public)} companies from {PUBLIC_CSV}")
    
    # Create dictionary of company names to tickers
    target_companies = dict(zip(df_public['Company'], df_public['Ticker']))
    
    # Setup driver and scrape
    driver = setup_driver()
    today = datetime.utcnow().strftime('%Y-%m-%d')
    
    try:
        found_companies = scrape_all_pages(driver, target_companies)
        
        if not found_companies:
            print("\n❌ No companies found!")
            return
        
        # Create output dataframe
        df_output = pd.DataFrame(found_companies.values())
        df_output['Date'] = today
        
        # Reorder columns
        df_output = df_output[['Company', 'Ticker', 'Full Name', 'Market Cap', 'Market Cap Numeric', 'Rank', 'Date']]
        
        # Sort by market cap
        df_output = df_output.sort_values('Market Cap Numeric', ascending=False)
        
        # Save to CSV
        df_output.to_csv(OUTPUT_CSV, index=False)
        print(f"\n✓ Saved {len(df_output)} companies to {OUTPUT_CSV}")
        
        # Print summary
        print("\n" + "="*80)
        print("SUMMARY")
        print("="*80)
        total_market_cap = df_output['Market Cap Numeric'].sum()
        print(f"Total Market Cap: ${total_market_cap / 1_000_000_000_000:.2f}T")
        print(f"\nTop 5 by Market Cap:")
        for idx, row in df_output.head().iterrows():
            print(f"  {row['Rank']}. {row['Company']} ({row['Ticker']}): {row['Market Cap']}")
        
        # Upload to GitHub
        if GITHUB_TOKEN:
            print("\n" + "="*80)
            print("UPLOADING TO GITHUB")
            print("="*80)
            
            try:
                auth = Auth.Token(GITHUB_TOKEN)
                g = Github(auth=auth)
                repo = g.get_repo(REPO_NAME)
                timestamp = datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')
                
                with open(OUTPUT_CSV, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                commit_msg = f"Update pubtotal.csv - {timestamp}"
                
                try:
                    file_obj = repo.get_contents(OUTPUT_CSV)
                    repo.update_file(OUTPUT_CSV, commit_msg, content, file_obj.sha)
                    print(f"✓ Updated {OUTPUT_CSV} on GitHub")
                except:
                    repo.create_file(OUTPUT_CSV, commit_msg, content)
                    print(f"✓ Created {OUTPUT_CSV} on GitHub")
                
                print("\n✅ Upload successful!")
                
            except Exception as e:
                print(f"\n❌ GitHub upload error: {e}")
        else:
            print("\n⚠️ No GitHub token found, skipping upload")
        
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
