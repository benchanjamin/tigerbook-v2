from django.core.management.base import BaseCommand
from tigerbook.settings import BASE_DIR
from base.models import (
    UndergraduateTigerBookHousing
)
import csv
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        UndergraduateTigerBookHousing.objects.all().delete()
        tigerbook_cities_csv_path = str(
            BASE_DIR / "data" / "populate_undergraduate_tigerbook_housing" / "room_info.csv")
        with open(tigerbook_cities_csv_path, mode='r') as csv_file:
            csv_reader = csv.DictReader(csv_file)
            for row in csv_reader:
                building = row['building']
                room_no = row['room_no']
                UndergraduateTigerBookHousing.objects.create(building=building, room_no=room_no,
                                                             entire_location_string=f"{building}, {room_no}")
                log.info(
                    f"Added room to UndergraduateTigerBookHousing: {building} {room_no}"
                )
