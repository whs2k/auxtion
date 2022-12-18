import requests as r
import pandas as pd
from datetime import datetime

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
with open('ppra.html', 'w') as f:
    f.write(html_string %(table_html))