from base.models import (OITActiveDirectoryUndergraduateGraduateInfo,
                         CurrentUndergraduateResidentialCollegeFacebookDirectory,
                         UndergraduateTigerBookDirectory,
                         UndergraduateTigerBookDirectoryPermissions,
                         UndergraduateTigerBookTracks,
                         UndergraduateTigerBookConcentrations,
                         UndergraduateTigerBookClassYears,
                         UndergraduateTigerBookResidentialColleges,
                         SetupTigerBookDirectoryStages
                         )
from uniauth.utils import get_account_username_split
from active_directory.req_lib import ReqLib
from django.core.exceptions import PermissionDenied


def add_to_undergraduate_tigerbook_directory(user):
    net_id = user.cas_profile.net_id
    req_lib = ReqLib()
    req = req_lib.get_info_for_tigerbook(net_id)
    if not OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).exists():
        active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.create(**req)
    else:
        active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).first()
    if not req:
        PermissionDenied("OIT Active Directory does not contain your Princeton netID")
    residential_college_facebook_entry = CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(
        email=active_directory_entry.email).first()
    if residential_college_facebook_entry:
        concentration = residential_college_facebook_entry.concentration
        track = residential_college_facebook_entry.track
        residential_college = residential_college_facebook_entry.residential_college
    class_year = active_directory_entry.department.split(" ")[-1]
    permissions = UndergraduateTigerBookDirectoryPermissions.objects.create()
    has_setup_profile = SetupTigerBookDirectoryStages.objects.create()
    UndergraduateTigerBookDirectory.objects.create(user=user,
                                                   has_setup_profile=has_setup_profile,
                                                   active_directory_entry=active_directory_entry,
                                                   residential_college_facebook_entry=
                                                   residential_college_facebook_entry,
                                                   permissions=permissions,
                                                   concentration=UndergraduateTigerBookConcentrations.objects.get(
                                                       concentration=concentration),
                                                   track=UndergraduateTigerBookTracks.objects.get(track=track),
                                                   class_year=UndergraduateTigerBookClassYears.objects.get(
                                                       class_year=class_year),
                                                   residential_college=
                                                   UndergraduateTigerBookResidentialColleges.objects.get
                                                   (residential_college=residential_college))


# TODO: Update in case their OIT ActiveDirectory info changes
def update_undergraduate_tigerbook_directory(user):
    # TODO: add this condition if statement always before using `get_account_username_split`
    net_id = user.profile.net_id
    req_lib = ReqLib()
    req = req_lib.get_info_for_tigerbook(net_id)
    active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).first()
    if not active_directory_entry:
        PermissionDenied("OIT Active Directory does not contain your Princeton netID")
    residential_college_facebook_entry = CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(
        email=active_directory_entry.email).first()
    UndergraduateTigerBookDirectory.objects.update(
        active_directory_entry=
        active_directory_entry,
        residential_college_facebook_entry=
        residential_college_facebook_entry)


# def add_to_graduate_tigerbook_directory(user):
#     # TODO: add this condition if statement always before using `get_account_username_split`
#     if user.username.startswith("cas"):
#         username_split = get_account_username_split(user.username)
#         net_id = username_split[2]
#         req_lib = ReqLib()
#         req = req_lib.get_info_for_tigerbook(net_id)
#         active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.create(**req)
#         if not active_directory_entry:
#             PermissionDenied("OIT Active Directory does not contain your Princeton netID")
#         permissions = GraduateTigerBookDirectory.create()
#         has_setup_profile = SetupTigerBookDirectoryStages.objects.create()
#         GraduateTigerBookDirectoryPermissions.objects.create(user=user,
#                                                              has_setup_profile=has_setup_profile,
#                                                              active_directory_entry=active_directory_entry,
#                                                              permissions=permissions
#                                                              )
#
#
# def update_graduate_tigerbook_directory(user):
#     # TODO: add this condition if statement always before using `get_account_username_split`
#     if user.username.startswith("cas"):
#         username_split = get_account_username_split(user.username)
#         net_id = username_split[2]
#         req_lib = ReqLib()
#         req = req_lib.get_info_for_tigerbook(net_id)
#         active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(**req).first()
#         if not active_directory_entry:
#             PermissionDenied("OIT Active Directory does not contain your Princeton netID")
#         GraduateTigerBookDirectory.objects.update(
#             active_directory_entry=
#             active_directory_entry,
#         )
