from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from base.models import (
    TigerBookInterests,
)
import csv
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        TigerBookInterests.objects.all().delete()
        tigerbook_certificates_txt_path = str(
            BASE_DIR / "data" / "populate_tigerbook_interests" /
            "interests.txt")
        with open(tigerbook_certificates_txt_path) as file:
            while line := file.readline():
                interest = line.rstrip()
                TigerBookInterests.objects.create(interest=interest)
                log.info(
                    f"Added certificate to TigerBookInterests: {interest}"
                )
