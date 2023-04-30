from django.core.management.base import BaseCommand

from active_directory.req_lib import ReqLib
from base.models import (
    UndergraduateToBeApprovedCategories, UndergraduateTigerBookDirectory, OITActiveDirectoryUndergraduateGraduateInfo,
    CurrentUndergraduateResidentialCollegeFacebookDirectory, UndergraduateTigerBookConcentrations,
    UndergraduateTigerBookTracks, UndergraduateTigerBookResidentialColleges, UndergraduateTigerBookClassYears,
    UndergraduateTigerBookDirectoryPermissions, SetupTigerBookDirectoryStages, GenericTigerBookDirectory
)
from utils.color_logging import log


class Command(BaseCommand):

    # TODO: put logging
    def handle(self, *args, **options):
        # TODO: for every net_id in active directory table add to undergraduate tigerbook directory
        for student in CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.all():
            student_oit_object = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(email=student.email).first()
            if student_oit_object is None:
                continue
            if hasattr(student_oit_object, 'net_id') is False:
                continue
            net_id = student_oit_object.net_id
            req_lib = ReqLib()
            req = req_lib.get_info_for_tigerbook(net_id)
            if not type(req) is dict:
                continue
            if OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).exists():
                active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).first()
            else:
                active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.create(**req)
            # if not active_directory_entry:
            #     continue
            # print('req', req)
            residential_college_facebook_entry = CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(
                email=active_directory_entry.email).first()
            # print('res_coll_entry', residential_college_facebook_entry)
            concentration = None
            track = None
            residential_college = None
            if residential_college_facebook_entry:
                concentration = UndergraduateTigerBookConcentrations.objects.get(
                    concentration=residential_college_facebook_entry.concentration)
                track = UndergraduateTigerBookTracks.objects.get(
                    track=residential_college_facebook_entry.track)
                residential_college = UndergraduateTigerBookResidentialColleges.objects.get(
                    residential_college=residential_college_facebook_entry.residential_college)
            class_year = UndergraduateTigerBookClassYears.objects.get(
                class_year=active_directory_entry.department.split(" ")[-1])
            permissions = UndergraduateTigerBookDirectoryPermissions.objects.create()
            has_setup_profile = SetupTigerBookDirectoryStages.objects.create()
            print('active_directory_entry', active_directory_entry)
            if not UndergraduateTigerBookDirectory.objects.filter(
                    residential_college_facebook_entry__email=student.email).exists():
                undergraduate_tigerbook_entry = UndergraduateTigerBookDirectory.objects.create(
                    has_setup_profile=has_setup_profile,
                    active_directory_entry=
                    active_directory_entry,
                    residential_college_facebook_entry=
                    residential_college_facebook_entry,
                    permissions=permissions,
                    concentration=concentration,
                    track=track,
                    class_year=
                    class_year,
                    residential_college=
                    residential_college)
                GenericTigerBookDirectory.objects.create(tigerbook_directory_username=net_id,
                                                         tigerbook_entry=undergraduate_tigerbook_entry)
                log.info(f"created UndergraduateTigerBookDirectory for {net_id}")
