import pandas as pd
import os

def convert_to_billions(value):
    """Convert market cap string to billions"""
    if pd.isna(value):
        return 0
    
    value_str = str(value).strip().upper()
    
    # Remove $ and spaces
    value_str = value_str.replace('$', '').replace(' ', '')
    
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
    pubtotal = pd.read_csv('data/pubtotal.csv')
    priv = pd.read_csv('data/priv.csv')
    core = pd.read_csv('data/core.csv')
    
    # Process pubtotal: convert market cap to billions
    pubtotal['Market Cap ($B)'] = pubtotal['Market Cap Numeric'].apply(convert_to_billions)
    
    # Create lookup dictionaries
    public_valuations = dict(zip(pubtotal['Ticker'], pubtotal['Market Cap ($B)']))
    private_valuations = dict(zip(priv['Company'], priv['Latest Valuation ($B)']))
    
    # Process core.csv
    results = []
    
    for _, row in core.iterrows():
        camp = row['CAMP']
        status = row['Status'].lower()
        allocation_pct = float(row['Allocation'].strip('%')) / 100
        
        if status == 'public':
            ticker = row['Ticker']
            company = row.get('Company', ticker)  # Use ticker as fallback if Company column doesn't exist
            valuation = public_valuations.get(ticker, 0)
            equity_value = valuation * allocation_pct
            
            results.append({
                'CAMP': camp,
                'company': company,
                'status': 'public',
                'equity($bn)': round(equity_value, 1)
            })
        
        elif status == 'private':
            company = row['Company']
            valuation = private_valuations.get(company, 0)
            equity_value = valuation * allocation_pct
            
            results.append({
                'CAMP': camp,
                'company': company,
                'status': 'private',
                'equity($bn)': round(equity_value, 1)
            })
    
    # Create output dataframe
    sumtotal = pd.DataFrame(results)
    
    # Sort by CAMP and equity value
    sumtotal = sumtotal.sort_values(['CAMP', 'equity($bn)'], ascending=[True, False])
    
    # Save to CSV
    os.makedirs('data', exist_ok=True)
    sumtotal.to_csv('data/sumtotal.csv', index=False)
    
    print("✓ Successfully generated data/sumtotal.csv")
    print(f"\nTotal rows: {len(sumtotal)}")
    print("\nSample output:")
    print(sumtotal.head(10).to_string(index=False))
    
    # Print summary by CAMP
    print("\n\nSummary by CAMP:")
    print(sumtotal.groupby('CAMP')['equity($bn)'].agg(['sum', 'count']).round(1))

if __name__ == "__main__":
    main()
