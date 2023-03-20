import requests
import json
import base64
from django.conf import settings


class Configs:
    def __init__(self):
        # TODO: change these keys to be of a tigerbook service account rather than my netID
        self.CONSUMER_KEY = settings.OIT_CONSUMER_KEY
        self.CONSUMER_SECRET = settings.OIT_CONSUMER_SECRET
        self.BASE_URL = settings.OIT_BASE_URL
        self.USERS = "/users"
        self.USERS_BASIC = "/users/basic"
        self.USERS_FULL = "/users/full"
        self.GROUPS = "/groups"
        self.MEMBERS = "/members"
        self.MEMBERS_FULL = "/members/full"
        self.REFRESH_TOKEN_URL = settings.OIT_REFRESH_TOKEN_URL
        self._refreshToken(grant_type="client_credentials")

    def _refreshToken(self, **kwargs):
        req = requests.post(
            self.REFRESH_TOKEN_URL,
            data=kwargs,
            headers={
                "Authorization": "Basic " + base64.b64encode(
                    bytes(self.CONSUMER_KEY + ":" + self.CONSUMER_SECRET, "utf-8")).decode("utf-8")
            },
        )
        text = req.text
        response = json.loads(text)
        self.ACCESS_TOKEN = response["access_token"]
