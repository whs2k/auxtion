import pandas as pd
import requests
from datetime import datetime
import sys
import helper
import traceback



pd.set_option('display.max_colwidth', -1)

#https://developer.ebay.com/my/auth/?env=sandbox&index=0
dummy_key = sys.argv[1]

df_fn = 'scrapped_data.csv'

try:
    helper.pull_and_save_ebay_data(api_key=dummy_key, save_fn=df_fn)
except Exception as e: 
    print(e)
    traceback.print_exc()
    print('using existing df')
    pass

df = pd.read_csv(df_fn)

table_html = df.to_html(index=False,render_links=True, justify="center", 
    escape=False, border=4,  classes=['table', 'table-hover', 'table-condensed'])
#body_html_string = body_html_string.format(html_table=table_html)#body %(table_html)

helper.create_and_save_html_page(df_html=table_html, header_fn='navbar.html', footer_fn='footer.html')