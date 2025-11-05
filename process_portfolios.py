import pandas as pd
import os

def convert_to_billions(value):
    """Convert market cap string to billions"""
    if pd.isna(value):
        return 0
    
    value_str = str(value).strip().upper()
    
    # Remove $ and spaces
    value_str = value_str.replace('$', '').replace(',', '').replace(' ', '')
    
    try:
        if 'T' in value_str:
            # Trillions to billions
            return float(value_str.replace('T', '')) * 1000
        elif 'B' in value_str:
            # Already in billions
            return float(value_str.replace('B', ''))
        elif 'M' in value_str:
            # Millions to billions
            return float(value_str.replace('M', '')) / 1000
        else:
            # Assume it's a raw number
            num = float(value_str)
            # If it's a very large number, assume it's in dollars
            if num > 1e9:
                return num / 1e9
            return num
    except ValueError:
        return 0

def main():
    # Read CSV files
    print("Reading CSV files...")
    pubtotal = pd.read_csv('data/pubtotal.csv')
    priv = pd.read_csv('data/priv.csv')
    core = pd.read_csv('data/core.csv')
    
    # Debug: Print column names
    print("\nColumns in core.csv:", core.columns.tolist())
    print("Columns in pubtotal.csv:", pubtotal.columns.tolist())
    print("Columns in priv.csv:", priv.columns.tolist())
    
    # Normalize column names (strip whitespace, handle case variations)
    core.columns = core.columns.str.strip()
    pubtotal.columns = pubtotal.columns.str.strip()
    priv.columns = priv.columns.str.strip()
    
    # Process pubtotal: convert market cap to billions
    pubtotal['Market Cap ($B)'] = pubtotal['Market Cap Numeric'].apply(convert_to_billions)
    
    # Create lookup dictionaries
    public_valuations = dict(zip(pubtotal['Ticker'], pubtotal['Market Cap ($B)']))
    private_valuations = dict(zip(priv['Company'], priv['Latest Valuation ($B)']))
    
    # Add manual mappings for special cases
    ticker_mapping = {
        'ANTH': 'Anthropic',
        'STRIPE': 'Stripe',
        'REVOLUT': 'Revolut',
        'TERA': 'Terawatt Infra',
        'DATABRICKS': 'Databricks',
        'Hoffman': 'LinkedIn-Greylock',
        'Benioff': 'Salesforce founder',
        'SPCX': 'SpaceX',
        'SCALE': 'ScaleAi',
        'ANDUR': 'Anduril',
    }
    
    # Ticker aliases for public companies (alternate ticker symbols)
    ticker_aliases = {
        'SFTBY': 'OTC-SFTBY',  # SoftBank alternate ticker
        'GOOGL': 'GOOG',        # Alphabet alternate ticker
    }
    
    # Default valuations for companies not in datasets (in billions)
    default_valuations = {
        'C3.AI': 2.5,  # Small-cap AI company
        'Terawatt Infra': 5.0,  # Estimated for infrastructure startup
        'LinkedIn-Greylock': 0.0,  # Individual investor, no equity value
        'Salesforce founder': 0.0,  # Individual investor, no equity value
    }
    
    # Process core.csv
    results = []
    
    for idx, row in core.iterrows():
        try:
            # Get Camp value
            camp = row['Camp']
            
            # Get status
            status = str(row['status']).lower().strip()
            
            # Get allocation percentage
            allocation_str = str(row['allocation']).strip().replace('%', '')
            allocation_pct = float(allocation_str) / 100
            
            if status == 'public':
                ticker = row['Ticker']
                company = row.get('Company', ticker)
                
                # Check for ticker alias
                lookup_ticker = ticker_aliases.get(ticker, ticker)
                valuation = public_valuations.get(lookup_ticker, 0)
                
                # Check default valuations if not found
                if valuation == 0 and ticker in default_valuations:
                    valuation = default_valuations[ticker]
                elif valuation == 0 and company in default_valuations:
                    valuation = default_valuations[company]
                
                if valuation == 0:
                    print(f"Warning: No valuation found for ticker {ticker} (looked up as {lookup_ticker})")
                
                equity_value = valuation * allocation_pct
                
                results.append({
                    'CAMP': camp,
                    'company': company,
                    'status': 'public',
                    'equity($bn)': round(equity_value, 1)
                })
            
            elif status == 'private':
                ticker = row['Ticker']
                company = row['Company']
                
                # Map ticker to company name if needed
                if ticker in ticker_mapping:
                    lookup_company = ticker_mapping[ticker]
                else:
                    lookup_company = company
                
                valuation = private_valuations.get(lookup_company, 0)
                
                # Check default valuations if not found
                if valuation == 0 and lookup_company in default_valuations:
                    valuation = default_valuations[lookup_company]
                elif valuation == 0 and company in default_valuations:
                    valuation = default_valuations[company]
                
                if valuation == 0:
                    print(f"Warning: No valuation found for private company {lookup_company} (ticker: {ticker})")
                
                equity_value = valuation * allocation_pct
                
                results.append({
                    'CAMP': camp,
                    'company': company,
                    'status': 'private',
                    'equity($bn)': round(equity_value, 1)
                })
            
            elif status == 'gov':
                # Government entities have no equity value
                company = row['Company']
                results.append({
                    'CAMP': camp,
                    'company': company,
                    'status': 'gov',
                    'equity($bn)': 0.0
                })
            else:
                print(f"Warning: Unknown status '{status}' for row {idx}")
        
        except Exception as e:
            print(f"Error processing row {idx}: {e}")
            print(f"Row data: {row.to_dict()}")
            continue
    
    if not results:
        print("ERROR: No results generated. Please check your CSV files and column names.")
        return
    
    # Create output dataframe
    sumtotal = pd.DataFrame(results)
    
    # Sort by CAMP and equity value
    sumtotal = sumtotal.sort_values(['CAMP', 'equity($bn)'], ascending=[True, False])
    
    # Save to CSV
    os.makedirs('data', exist_ok=True)
    sumtotal.to_csv('data/sumtotal.csv', index=False)
    
    print("\n✓ Successfully generated data/sumtotal.csv")
    print(f"\nTotal rows: {len(sumtotal)}")
    print("\nSample output:")
    print(sumtotal.head(10).to_string(index=False))
    
    # Print summary by CAMP
    print("\n\nSummary by CAMP:")
    summary = sumtotal.groupby('CAMP')['equity($bn)'].agg(['sum', 'count']).round(1)
    print(summary)

if __name__ == "__main__":
    main()
