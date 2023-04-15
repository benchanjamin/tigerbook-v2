from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from base.models import (
    TigerBookCities, UndergraduateTigerBookCertificates
)
import csv
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        UndergraduateTigerBookCertificates.objects.all().delete()
        tigerbook_certificates_txt_path = str(
            BASE_DIR / "data" / "populate_undergraduate_tigerbook_certificates" /
            "certificates.txt")
        with open(tigerbook_certificates_txt_path) as file:
            while line := file.readline():
                certificate = line.rstrip()
                UndergraduateTigerBookCertificates.objects.create(certificate=certificate)
                log.info(
                    f"Added certificate to TigerBookCertificates: {certificate}"
                )
