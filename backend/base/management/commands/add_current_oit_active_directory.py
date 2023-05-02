from django.conf import settings
from django.core.management.base import BaseCommand
from active_directory.req_lib import ReqLib
from base.models import (OITActiveDirectoryUndergraduateGraduateInfo,
                         CurrentUndergraduateResidentialCollegeFacebookDirectory,
                         )
from utils.color_logging import log
from datetime import datetime
import re


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        OITActiveDirectoryUndergraduateGraduateInfo.objects.all().delete()

        req_lib = ReqLib()
        today = datetime.today()
        # Add a year to the current year
        # to the rolling window of size 4 when this script is run after the month of June
        if today.month > 6:
            valid_class_years = [i for i in range(today.year + 1, today.year + 5)]
        else:
            valid_class_years = [i for i in range(today.year, today.year + 4)]

        for class_year in valid_class_years:
            class_year_students = req_lib.getJSON(
                req_lib.configs.MEMBERS_FULL,
                group=f"Undergraduate Class of {class_year}",
            )
            for class_year_student in class_year_students:
                net_id = class_year_student.get('netid', None)
                full_name = re.sub(r' [A-Z]*\. ', ' ', class_year_student.get('full_name', None))
                puid = class_year_student.get('emplid', None)
                email = class_year_student.get('email', None)
                if email:
                    email = email.lower()
                department = class_year_student.get('department', None)
                interoffice_address = class_year_student.get('interoffice_address', None)
                log.info(
                    f"Running on student: {net_id}, {full_name}, {puid}, {email}, {department}, {interoffice_address}")
                # if not CumulativeTigerBookNetIDs.objects.filter(net_id=net_id).exists():
                #     log.info(
                #         f"Added student's netID to CumulativeTigerBookNetIDs Table: {net_id}")
                #     CumulativeTigerBookNetIDs.objects.create(net_id=net_id)
                if not OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(net_id=net_id, full_name=full_name,
                                                                                  puid=puid,
                                                                                  email=email,
                                                                                  interoffice_address=interoffice_address,
                                                                                  department=department).exists():
                    log.info(
                        f"Added student to OITActiveDirectoryUserInfo Table: {net_id}, {full_name}, {puid}, {email}, "
                        f"{department}, {interoffice_address}")
                    OITActiveDirectoryUndergraduateGraduateInfo.objects.create(net_id=net_id, full_name=full_name,
                                                                               puid=puid,
                                                                               email=email,
                                                                               interoffice_address=interoffice_address,
                                                                               department=department)
