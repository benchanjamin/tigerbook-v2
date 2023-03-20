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
        token ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc4NTQ1MTAyLCJpYXQiOjE2Nzg1NDQ4MDIsImp0aSI6IjUwYjNkNzNlMDU2YTQ3NDlhYTQzYTNlOWY0N2ZlZDIxIiwidXNlcl9pZCI6MTl9.yzBlwJfN5oe7lUKdLwrQqSFsNRd8yRWkG6IaHBkGLwo'
        headers = {
            "Authorization": f"Bearer {token}"
        }
        endpoint = "http://localhost:8000/api/setup/"
        get_response = requests.get(endpoint, headers=headers)
        print(get_response.json())
