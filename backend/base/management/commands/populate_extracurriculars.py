from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from base.models import (
    TigerBookExtracurriculars
)
import csv
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        TigerBookExtracurriculars.objects.all().delete()
        tigerbook_extracurriculars_txt_path = str(
            BASE_DIR / "data" / "populate_undergraduate_tigerbook_certificates" /
            "extracurriculars.txt")
        with open(tigerbook_extracurriculars_txt_path) as file:
            while line := file.readline():
                extracurricular, subgroup = line.split(', ')
                TigerBookExtracurriculars.objects.create(extracurricular=extracurricular, subgroup=subgroup)
                log.info(
                    f"Added extracurricular to TigerBookExtracurriculars: {extracurricular}"
                )
