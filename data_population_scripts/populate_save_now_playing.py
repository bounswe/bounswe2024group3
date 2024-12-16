import requests
import pandas as pd
import random
import json


def get_user_details(user_num=0):
    user_details = pd.read_csv("user_details.csv")
    user_details = user_details.iloc[user_num]
    user_details = user_details.to_dict()
    return user_details


def get_song_links(path="songs.json"):
    with open(path) as f:
        songs = json.load(f)

    song_links = []
    
    for track in songs["tracks"]["items"]:
        song_links.append(track["track"]["href"])
        # track['link'] = f"https://open.spotify.com/track/{track['id']}"

    return song_links


def save_now_playing_main():
    world_cities = pd.read_csv("worldcities.csv")
    user_details_df = pd.read_csv("user_details.csv")
    # print(user_details)
    song_links = get_song_links()

    for user_idx in range(len(user_details_df)):
        user_details = user_details_df.iloc[user_idx].to_dict()
        city = world_cities.iloc[user_idx%len(world_cities)].to_dict()
        user_login_body = {
            "username": user_details["username"],
            "password": user_details["password"]
        }

        res = requests.post("https://spotonapp.win/api/login/", json=user_details, verify=False)
        print(res)
    
        song_link = song_links[user_idx%len(song_links)]

        now_playing_body = {
            "latitude": city["lat"],
            "longitude": city["lng"],
            "link": song_link
        }

        res = requests.post("https://spotonapp.win/api/save-now-playing/?", json=now_playing_body, verify=False)
        print(res)


save_now_playing_main('songs.json') # This should be a path to a json file from a playlist spotify API call