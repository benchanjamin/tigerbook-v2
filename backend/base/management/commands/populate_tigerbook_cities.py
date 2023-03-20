from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from django.core.files import File
from base.models import (
    TigerBookCities
)
import csv
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        TigerBookCities.objects.all().delete()
        tigerbook_cities_csv_path = str(
            BASE_DIR / "static" / "populate_tigerbook_cities" /
            "simplemaps_worldcities_basicv1.75" / "worldcities.csv")
        with open(tigerbook_cities_csv_path, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                city = row['city']
                latitude = row['lat']
                longitude = row['lng']
                country = row['country']
                admin_name = row['admin_name']
                TigerBookCities.objects.create(city=city,
                                               latitude=latitude,
                                               longitude=longitude,
                                               country=country,
                                               admin_name=admin_name
                                               )
                log.info(
                    f"Added city to TigerBookCities: {city} {admin_name} {country}"
                )
