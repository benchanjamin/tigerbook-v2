from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from django.core.files import File
from uniauth.models import (
    InstitutionAccount,
    LinkedEmail,
    UserProfile
)
from base.models import UndergraduateTigerBookDirectory
from django.contrib.auth.models import User
import json
from pathlib import Path
import os
import tempfile
from utils.color_logging import log


class Command(BaseCommand):

    def handle(self, *args, **options):
        import requests
        # from getpass import getpass

        # password = getpass()
        # auth_endpoint = "http://localhost:8000/api/token/"
        #
        # login_creds = {
        #     "username": "cas-princeton-bychan",
        #     "password": ""
        # }
        #
        # auth_response = requests.post(auth_endpoint, json=login_creds)
        # print(auth_response.json())

        # if auth_response.status_code == 200:


        token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjgxMjIxODIxLCJpYXQiOjE2ODEyMjE1MjEsImp0aSI6ImVkNDg4MDNiODM5ZTQ3MjA4YjI5NTY0YmZlNDEzYmYyIiwidXNlcl9pZCI6MX0.xG7tD8wK3lbbTaqAcm10LFeqCFZPFm9JU2zZUBQ-zx8"
        headers = {
            "Authorization": f"Bearer {token}"
        }
        endpoint = "https://tiger-book.com/api/list/"
        get_response = requests.get(endpoint, headers=headers, verify=False)
        print(get_response.status_code)
        print(get_response.json())
