import requests
import pandas as pd
import random

def get_random_user_details(user_count=1):

    res = requests.get("https://randomuser.me/api/?results=" + str(user_count)+"&nat=de,dk,fr,gb,mx,nl,rs,tr,us")
    data = res.json()
    user_details = []

    for user in data['results']:
        user_details.append({
            "username": user['login']['username'],
            "name": user['name']['first'],
            "surname": user['name']['last'],
            "email": user['email'],
            "password": user['login']['password'],
            "labels": list(dict.fromkeys(random.choices(["Artist", "Listener","Teacher", "Producer"], k=2)))
        })


    return user_details

def register_accounts(user_count=1):

    url = "https://spotonapp.win/api/register/?"

    user_details = get_random_user_details(user_count)
    df = pd.DataFrame(user_details)
    df.to_csv("user_details.csv", index=False)

    for user in user_details:
        res = requests.post(url, json=user, verify=False)

register_accounts(100)