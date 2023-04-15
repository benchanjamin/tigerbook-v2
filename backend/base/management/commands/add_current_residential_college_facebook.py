from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from django.core.files import File
from base.models import (
    CurrentUndergraduateResidentialCollegeFacebookDirectory,
    UndergraduateTigerBookTracks,
    UndergraduateTigerBookConcentrations,
    UndergraduateTigerBookResidentialColleges,
    UndergraduateTigerBookClassYears
)
import json
from pathlib import Path
import os
import tempfile
from utils.color_logging import log
from django.conf import settings

from utils.storage_backends import PrivateResidentialCollegeFacebookMediaStorage


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        # can comment the 6 below lines to update table intermittently
        # UndergraduateTigerBookTracks.objects.all().delete()
        # UndergraduateTigerBookConcentrations.objects.all().delete()
        # UndergraduateTigerBookClassYears.objects.all().delete()
        # UndergraduateTigerBookResidentialColleges.objects.all().delete()
        CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.all().delete()
        # UndergraduateTigerBookTracks.objects.create(track="UNDECLARED")

        backend_app_file_path = BASE_DIR
        webscrapper_results_json_path = str(Path(backend_app_file_path).parents[0]) + "/webscrapper/results.json"
        webscrapper_undergrad_images_folder_path = str(
            Path(backend_app_file_path).parents[0]) + "/webscrapper/undergrad-images"
        with open(webscrapper_results_json_path, encoding='utf-8') as json_file:
            residential_college_data = json.load(json_file)
        for student in residential_college_data:
            full_name = student['name']
            email = student['email']
            track = student['track']
            concentration = student['concentration']
            class_year = student['classYear']
            residential_college = student['resCollege']
            img_name = student['imgName']
            log.info(
                f"Running on student: {full_name}, {email}, {track}, "
                f"{concentration}, {class_year}, {residential_college}, {img_name}"
            )
            if not CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(full_name=full_name).exists():
                log.info(
                    f"Added student to CurrentResidentialCollegeFacebookDirectory: {full_name}, {email}, {track}, "
                    f"{concentration}, {class_year}, {residential_college}"
                )
                # TODO: turn back on images
                temp_file = tempfile.NamedTemporaryFile(dir='media', delete=True)
                local_file = open(webscrapper_undergrad_images_folder_path + f"/{img_name}", 'rb')
                temp_file.write(local_file.read())
                residential_college_picture_url = File(temp_file, name=img_name)
                CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.create(full_name=full_name,
                                                                                       email=email,
                                                                                       track=track,
                                                                                       concentration=concentration,
                                                                                       class_year=class_year,
                                                                                       residential_college=
                                                                                       residential_college,
                                                                                       residential_college_picture_url=
                                                                                       residential_college_picture_url)
                temp_file.close()

            if not UndergraduateTigerBookTracks.objects.filter(track=track).exists():
                UndergraduateTigerBookTracks.objects.create(track=track)

            if not UndergraduateTigerBookConcentrations.objects.filter(concentration=concentration).exists():
                log.info(
                    f"Added concentration to TigerBookTracks: {concentration}"
                )
                UndergraduateTigerBookConcentrations.objects.create(concentration=concentration)

            if not UndergraduateTigerBookResidentialColleges.objects.filter(
                    residential_college=residential_college).exists():
                log.info(
                    f"Added residential college to TigerBookResidentialColleges: {residential_college}"
                )
                UndergraduateTigerBookResidentialColleges.objects.create(residential_college=residential_college)

            if not UndergraduateTigerBookClassYears.objects.filter(class_year=class_year).exists():
                log.info(
                    f"Added class year to TigerBookResidentialColleges: {class_year}"
                )
                UndergraduateTigerBookClassYears.objects.create(class_year=class_year)
