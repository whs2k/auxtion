import requests
import pandas as pd
from datetime import datetime

def pull_and_save_ebay_data(api_key, save_fn):
    header = {'Authorization':'Bearer {}'.format(api_key),
              'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
              'Content-Type':'application/json'}
              #'X-EBAY-C-ENDUSERCTX':'affiliateCampaignId=<ePNCampaignId>,affiliateReferenceId=<referenceId>'}
    base_url = "https://api.sandbox.ebay.com/buy/marketplace_insights/v1_beta/item_sales/search?"
    query = "q=watch"
    sort = "&sort=-price"
    category = "&category_ids=31387"#281"
    filters = '''&filter=lastSoldDate:[2022-01-22T00:00:00Z..2022-12-24T00:00:00Z],
    conditions:{NEW|USED},price:[10..10000],priceCurrency:USD'''
    limit= "&limit=10"
    url = base_url+query+filters+sort+limit

    r = requests.get(url, headers=header)
    content = r.json()
    if r.status_code != 200:
        print(content)
    #print(content['total'])
    titles=[]
    sold_dates=[] 
    sold_prices=[] 
    web_urls = []
     
    for x in content['itemSales']:   
        titles.append(x['title'])
        sold_dates.append(x['lastSoldDate'])
        sold_prices.append(str(str(x['lastSoldPrice']['value'])+' ' +
                           str(x['lastSoldPrice']['currency'])))
        web_urls.append(x['itemWebUrl'])
    df = pd.DataFrame()
    df['title'] = titles
    df['sold_date'] = sold_dates
    df['sold_price'] = sold_prices
    df['web_url'] = web_urls
    df.to_csv(save_fn, index=False)
    print('saved df: ', df.head(), flush=True)

def create_and_save_html_page(df_html, header_fn='navbar.html', footer_fn='footer.html'):
    body_html_string = """
    <body>
        <h1>Auxtion; what's actually hot
        <h2>Welcome to auxtion.com where we scrape 
        the largest luxury purchases to show you what's actually sold</h2>
            <h3> Ebay </h3>
            {html_table}
    </body>
    """
    with open(footer_fn, 'r') as file:
        footer = file.read().replace('\n', '')
    with open(header_fn, 'r') as file:
        header = file.read().replace('\n', '')

    body_html_string = body_html_string.format(html_table=df_html)
    final = header +body_html_string+footer 
    final = final.format(most_recent_filing_date=today)
    with open('index.html', 'w') as file:
        file.write(final)
        
url_template = "https://ppra.org.pk/dad_tenders.asp?PageNo="
html_string = """
    <html>
    <head><title>Latest PPRA Tenders</title></head>
    <body>
        <style>
        table {
            border-collapse: collapse;
            border: 1px solid silver;
        }
        table tr:nth-child(even) {
            background: #E0E0E0;
        }
        </style>
        %s
    </body>
    </html>
"""
today = datetime.now()
d = {'col1': [today, 2], 'col2': [3, 4]}
filtered_df= pd.DataFrame(data=d)
# dfs = pd.read_html(html.text, attrs={'width': '656'}, header=0, parse_dates=['Advertised Date'])



table_html = filtered_df.to_html(index=False,render_links=True, justify="center", 
    escape=False, border=4)
print(today, flush=True)
with open('index.html', 'w') as f:
    f.write(html_string %(table_html))