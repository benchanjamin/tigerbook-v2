from base.models import (OITActiveDirectoryUndergraduateGraduateInfo,
                         CurrentUndergraduateResidentialCollegeFacebookDirectory,
                         UndergraduateTigerBookDirectory,
                         UndergraduateTigerBookDirectoryPermissions,
                         UndergraduateTigerBookTracks,
                         UndergraduateTigerBookConcentrations,
                         UndergraduateTigerBookClassYears,
                         UndergraduateTigerBookResidentialColleges,
                         SetupTigerBookDirectoryStages,
                         GenericTigerBookDirectory
                         )
from active_directory.req_lib import ReqLib
from django.core.exceptions import PermissionDenied


def add_to_undergraduate_tigerbook_directory(user):
    net_id = user.cas_profile.net_id
    req_lib = ReqLib()
    req = req_lib.get_info_for_tigerbook(net_id)
    if OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(
            **req).exists():
        active_directory_entry = (
            OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(
                **req
            ).first()
        )
    else:
        active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.create(**req)
    if not req:
        PermissionDenied("OIT Active Directory does not contain your Princeton netID")
    residential_college_facebook_entry = CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(
        email=active_directory_entry.email).first()
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
    undergrad_directory_object = UndergraduateTigerBookDirectory.objects.filter(active_directory_entry__net_id__exact
                                                                                =net_id).first()
    if undergrad_directory_object is None:
        undergraduate_tigerbook_entry = UndergraduateTigerBookDirectory.objects.create(user=
                                                                                       user,
                                                                                       has_setup_profile=
                                                                                       has_setup_profile,
                                                                                       active_directory_entry=
                                                                                       active_directory_entry,
                                                                                       residential_college_facebook_entry=
                                                                                       residential_college_facebook_entry,
                                                                                       permissions=
                                                                                       permissions,
                                                                                       concentration=
                                                                                       concentration,
                                                                                       track=track,
                                                                                       class_year=
                                                                                       class_year,
                                                                                       residential_college=
                                                                                       residential_college)
        GenericTigerBookDirectory.objects.create(tigerbook_directory_username=user.username,
                                                 tigerbook_entry=undergraduate_tigerbook_entry)
    else:
        # attached user to undergrad_directory_object
        undergrad_directory_object.user = user
        undergrad_directory_object.save()


def update_undergraduate_tigerbook_directory(user):
    net_id = user.cas_profile.net_id
    req_lib = ReqLib()
    req = req_lib.get_info_for_tigerbook(net_id)
    if not req:
        PermissionDenied("OIT Active Directory does not contain your Princeton netID")
    active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.filter(net_id__iexact=net_id).first()
    if not active_directory_entry:
        active_directory_entry = OITActiveDirectoryUndergraduateGraduateInfo.objects.create(**req)
        user.undergraduate_tigerbook_directory_entry.active_directory_entry.delete()
        user.undergraduate_tigerbook_directory_entry.active_directory_entry = active_directory_entry
    residential_college_facebook_entry = CurrentUndergraduateResidentialCollegeFacebookDirectory.objects.filter(
        email=active_directory_entry.email).first()
    user.undergraduate_tigerbook_directory_entry.residential_college_facebook_entry = residential_college_facebook_entry
    user.undergraduate_tigerbook_directory_entry.save()

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


def get_display_username(user_username):
    # username = self.user.username
    # if "@" in username:
    #     return username.split("@")[0]
    if user_username.startswith("cas-"):
        from uniauth.utils import get_account_username_split

        return get_account_username_split(user_username)[-1]
    return user_username
