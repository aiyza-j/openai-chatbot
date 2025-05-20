# scripts/get_openai_usage.py

import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_usage(start_date="2025-05-01", end_date="2025-05-20"):
    url = "https://api.openai.com/v1/dashboard/billing/usage"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }
    params = {
        "start_date": start_date,
        "end_date": end_date
    }

    response = requests.get(url, headers=headers, params=params)
    if response.status_code == 200:
        data = response.json()
        print("Usage:", data)
    else:
        print("Error:", response.status_code, response.text)

def get_subscription():
    url = "https://api.openai.com/v1/dashboard/billing/subscription"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}"
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Subscription Info:", response.json())
    else:
        print("Error:", response.status_code, response.text)

if __name__ == "__main__":
    get_subscription()
    get_usage()
