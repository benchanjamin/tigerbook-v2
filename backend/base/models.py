import datetime

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
import uuid
from utils.storage_backends import (
    PrivateTigerBookUndergraduateMediaStorage,
    PrivateTigerBookGraduateMediaStorage,
    PrivateTigerBookUndergraduateAlumniMediaStorage,
    PrivateTigerBookGraduateAlumniMediaStorage,
    PrivateResidentialCollegeFacebookMediaStorage, PrivateTigerBookExtracurricularsMediaStorage)

User = settings.AUTH_USER_MODEL  # default is 'auth.user'


class CASProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cas_profile')
    pu_status = models.TextField(null=True, blank=False)
    net_id = models.TextField(null=True, blank=False)


class OITActiveDirectoryUndergraduateGraduateInfo(models.Model):
    net_id = models.TextField(primary_key=True)
    full_name = models.TextField()
    puid = models.TextField(db_index=True)
    email = models.EmailField(null=True)
    department = models.TextField()
    # interoffice_address = models.TextField(null=True)
    pu_status = models.TextField(null=False, blank=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class CurrentUndergraduateResidentialCollegeFacebookDirectory(models.Model):
    full_name = models.TextField()
    email = models.EmailField(primary_key=True)
    track = models.TextField()
    concentration = models.TextField()
    class_year = models.IntegerField()
    residential_college = models.TextField()
    # TODO: call residential_college_picture_url.url to get S3 url
    residential_college_picture_url = models.FileField(storage=PrivateResidentialCollegeFacebookMediaStorage(),
                                                       null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class SetupTigerBookDirectoryStages(models.Model):
    has_setup_page_one = models.BooleanField(default=False)
    has_setup_page_two = models.BooleanField(default=False)


class UndergraduateTigerBookDirectory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    has_setup_profile = models.OneToOneField(SetupTigerBookDirectoryStages, on_delete=models.RESTRICT, null=False,
                                             related_name='undergraduate_tigerbook_directory_entry')
    # 'user' field handles net_id and email
    user = models.OneToOneField(User, on_delete=models.RESTRICT, null=False,
                                related_name="undergraduate_tigerbook_directory_entry")
    # 'active_directory_entry' field handles puid, full_name, net_id, and email for CAS users
    active_directory_entry = models.OneToOneField(OITActiveDirectoryUndergraduateGraduateInfo,
                                                  on_delete=models.SET_NULL,
                                                  null=True,
                                                  related_name="undergraduate_tigerbook_directory_entry")
    # 'residential_college_facebook_entry' handles current residential college facebook pics
    residential_college_facebook_entry = models.OneToOneField(CurrentUndergraduateResidentialCollegeFacebookDirectory,
                                                              on_delete=models.SET_NULL, null=True,
                                                              related_name="undergraduate_tigerbook_directory_entry")
    # TODO: customize visibility at the attribute level
    permissions = models.OneToOneField('UndergraduateTigerBookDirectoryPermissions', on_delete=models.RESTRICT,
                                       related_name="undergraduate_tigerbook_directory_entry")
    # TODO: All the below fields are nullable
    profile_pic = models.FileField(storage=PrivateTigerBookUndergraduateMediaStorage(),
                                   null=True)
    track = models.ForeignKey('UndergraduateTigerBookTracks',
                              related_name='undergraduates',
                              on_delete=models.RESTRICT, null=True)
    concentration = models.ForeignKey('UndergraduateTigerBookConcentrations',
                                      related_name='undergraduates',
                                      on_delete=models.RESTRICT, null=True)
    class_year = models.ForeignKey('UndergraduateTigerBookClassYears',
                                   related_name='undergraduates',
                                   on_delete=models.RESTRICT, null=True)
    residential_college = models.ForeignKey('UndergraduateTigerBookResidentialColleges',
                                            related_name='undergraduates',
                                            on_delete=models.RESTRICT, null=True)
    housing = models.ForeignKey('UndergraduateTigerBookHousing',
                                related_name='undergraduates',
                                on_delete=models.RESTRICT, null=True)
    aliases = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
    pronouns = models.ForeignKey('TigerBookPronouns',
                                 related_name='undergraduates',
                                 on_delete=models.RESTRICT,
                                 null=True,
                                 blank=False)
    certificates = models.ManyToManyField('UndergraduateTigerBookCertificates',
                                          related_name='undergraduates',
                                          null=True,
                                          blank=False)
    # TODO: the two below go together
    hometown = models.ForeignKey('TigerBookCities',
                                 related_name='undergraduates_hometown',
                                 on_delete=models.RESTRICT, null=True, blank=False)
    # home_countries = models.ManyToManyField('TigerBookCountries',
    #                                         related_name='undergraduates_home_countries',
    #                                         null=True,
    #                                         blank=False)
    # TODO: the two below go together
    current_city = models.ForeignKey('TigerBookCities',
                                     related_name='undergraduates_post_grad_city',
                                     on_delete=models.RESTRICT, null=True, blank=False)
    # post_grad_country = models.ForeignKey('TigerBookCountries', on_delete=models.RESTRICT,
    #                                       related_name='undergraduates_post_grad_country',
    #                                       null=True, blank=False)
    interests = models.ManyToManyField('TigerBookInterests', related_name='undergraduates', null=True,
                                       blank=False)
    # TODO: the two below go together
    extracurriculars = models.JSONField(null=True, blank=False)
    extracurricular_objs = models.ManyToManyField('TigerBookExtracurriculars', related_name='undergraduates',
                                                  null=True,
                                                  blank=False)
    extracurricular_position_objs = models.ManyToManyField('TigerBookExtracurricularPositions',
                                                           related_name='undergraduates',
                                                           null=True,
                                                           blank=False)
    # extracurricular_positions = models.ManyToManyField('TigerBookExtracurricularPositions',
    #                                                    related_name='undergraduates', null=True,
    #                                                    blank=False)
    # TODO: the two below go together
    research = models.JSONField(null=True, blank=False)
    research_objs = models.ManyToManyField('TigerBookResearchTypes',
                                           related_name='undergraduates',
                                           null=True,
                                           blank=False)
    # research_types = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
    # research_titles = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
    # TODO: the two below go together
    miscellaneous = models.JSONField(null=True, blank=False)
    # miscellaneous_titles = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
    # miscellaneous_descriptions = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
    #                                         blank=True)


class UndergraduateTigerBookDirectoryPermissions(models.Model):
    # TODO: add more general control for tigerbook listed users
    # Default should be true
    is_visible_to_undergrads = models.BooleanField(null=False, default=True)
    # Default should be true
    is_visible_to_faculty = models.BooleanField(null=False, default=True)
    # Default should be true
    is_visible_to_service_accounts = models.BooleanField(null=False, default=True)
    # Default should be false
    is_visible_to_graduate_students = models.BooleanField(null=False, default=False)
    # Default should be false
    # is_visible_to_alumni = models.BooleanField(null=False, default=False)
    # Default should be false
    is_visible_to_staff = models.BooleanField(null=False, default=False)
    # TODO: add finer control over which usernames and full names get to see which fields, tigerbook listed users
    # TODO: can add any username, as long as it is in OIT system
    username_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                               blank=True)
    profile_pic_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                  blank=True)
    track_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                            blank=True)
    concentration_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                    blank=True)
    class_year_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                 blank=True)
    residential_college_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True),
                                                          default=list,
                                                          blank=True)
    housing_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                              blank=True)
    aliases_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                              blank=True)
    pronouns_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                               blank=True)
    certificates_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                   blank=True)
    hometown_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                               blank=True)
    current_city_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True),
                                                   default=list, blank=True)
    interests_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                blank=True)
    extracurriculars_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True),
                                                       default=list, blank=True)
    research_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                               blank=True)
    miscellaneous_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                                    blank=True)


# class GraduateTigerBookDirectory(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4)
#     has_setup_profile = models.OneToOneField(SetupTigerBookDirectoryStages, on_delete=models.RESTRICT, null=False,
#                                              related_name='graduate_tigerbook_directory_entry')
#     # 'user' field handles net_id and email
#     user = models.OneToOneField(User, on_delete=models.RESTRICT, null=False,
#                                 related_name="graduate_tigerbook_directory_entry")
#     # 'active_directory_entry' field handles puid, full_name, net_id, and email for CAS users
#     active_directory_entry = models.OneToOneField(OITActiveDirectoryUndergraduateGraduateInfo,
#                                                   on_delete=models.SET_NULL,
#                                                   null=True,
#                                                   related_name="graduate_tigerbook_directory_permissions")
#     permissions = models.OneToOneField('GraduateTigerBookDirectoryPermissions',
#                                        on_delete=models.RESTRICT,
#                                        related_name="graduate_tigerbook_directory_entry")
#     # TODO: All the below fields are nullable
#     profile_pic = models.FileField(storage=PrivateTigerBookGraduateMediaStorage(),
#                                    null=True)
#     department = models.ForeignKey('GraduateTigerBookDepartment', related_name='graduates',
#                                    on_delete=models.RESTRICT, null=True)
#     programs = models.ManyToManyField('GraduateTigerBookPrograms', related_name='graduates', null=True)
#     graduation_year = models.ForeignKey('GraduateTigerBookGraduationYears', related_name='graduates',
#                                         on_delete=models.RESTRICT, null=True)
#     aliases = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
#     pronouns = models.ForeignKey('TigerBookPronouns',
#                                  on_delete=models.RESTRICT,
#                                  related_name='graduates', null=True,
#                                  blank=False)
#     certificates = models.ManyToManyField('GraduateTigerBookCertificates', related_name='graduates',
#                                           null=True,
#                                           blank=False)
#     # TODO: the two below go together
#     home_cities = models.ManyToManyField('TigerBookCities',
#                                          related_name='graduates_home_cities',
#                                          null=True,
#                                          blank=False)
#     # home_countries = models.ManyToManyField('TigerBookCountries',
#     #                                         related_name='graduates_home_countries',
#     #                                         null=True,
#     #                                         blank=False)
#     housing = models.TextField(null=True, blank=False)
#     housing_roommates = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
#     # TODO: the two below go together
#     current_city = models.ForeignKey('TigerBookCities', on_delete=models.RESTRICT, null=True, blank=False,
#                                      related_name='graduates_post_grad_city')
#     # post_grad_country = models.ForeignKey('TigerBookCountries', on_delete=models.RESTRICT,
#     #                                       related_name='graduates_post_grad_country',
#     #                                       null=True, blank=False)
#     interests = models.ManyToManyField('TigerBookInterests', related_name='graduates', null=True,
#                                        blank=False)
#     # TODO: the two below go together
#     extracurriculars = models.ManyToManyField('TigerBookExtracurriculars', related_name='graduates',
#                                               null=True,
#                                               blank=False)
#     extracurricular_positions = models.ManyToManyField('TigerBookExtracurricularPositions',
#                                                        related_name='graduates', null=True, blank=False)
#     # TODO: the two below go together
#     research_types = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
#     research_titles = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
#     # TODO: the two below go together
#     miscellaneous_titles = ArrayField(base_field=models.TextField(blank=False, null=True), default=list, blank=True)
#     miscellaneous_descriptions = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                             blank=True)


# class GraduateTigerBookDirectoryPermissions(models.Model):
#     # TODO: add more general control for tigerbook listed users
#     # Default should be true
#     is_visible_to_undergrads = models.BooleanField(null=False, default=True)
#     # Default should be true
#     is_visible_to_faculty = models.BooleanField(null=False, default=True)
#     # Default should be true
#     is_visible_to_service_accounts = models.BooleanField(null=False, default=True)
#     # Default should be false
#     is_visible_to_graduate_students = models.BooleanField(null=False, default=True)
#     # Default should be false
#     is_visible_to_alumni = models.BooleanField(null=False, default=False)
#     # Default should be false
#     is_visible_to_staff = models.BooleanField(null=False, default=False)
#     # TODO: add finer control over which usernames get to see which fields, tigerbook listed users
#     # TODO: can add any username
#     profile_pic_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                   blank=True)
#     department_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                  blank=True)
#     programs_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                blank=True)
#     graduation_year_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                       blank=True)
#     aliases_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                               blank=True)
#     pronouns_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                blank=True)
#     certificates_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                    blank=True)
#     home_cities_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                   blank=True)
#     current_city_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True),
#                                                    default=list,
#                                                    blank=True)
#     interests_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                 blank=True)
#     extracurriculars_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True),
#                                                        default=list, blank=True)
#     research_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
#                                                blank=True)


# class UndergraduateAlumniTigerBookDirectory(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4)
#     # 'user' field handles net_id and email
#     user = models.OneToOneField(User, on_delete=models.RESTRICT, null=False, related_name="tigerbook_directory_entry")
#     # TODO: All the below fields are nullable
#     profile_pic_url = models.FileField(storage=PrivateTigerBookUndergraduateAlumniMediaStorage(),
#                                        null=True)
#     concentration = models.ForeignKey('GraduateTigerBookDepartment', on_delete=models.RESTRICT, null=True)
#     programs = models.ManyToManyField('GraduateTigerBookPrograms', related_name='shared_people', null=True)
#     graduation_year = models.ForeignKey('GraduateTigerBookGraduationYears', on_delete=models.RESTRICT, null=True)
#     aliases = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     pronouns = models.ManyToManyField('TigerBookPronouns', related_name='shared_people', null=True, blank=False)
#     certificates = models.ManyToManyField('GraduateTigerBookCertificates', related_name='shared_people', null=True,
#                                           blank=False)
#     # TODO: the two below go together
#     home_cities = models.ManyToManyField('TigerBookCities', related_name='shared_people', null=True, blank=False)
#     home_countries = models.ManyToManyField('TigerBookCountries', related_name='shared_people', null=True,
#                                             blank=False)
#     # TODO: the two below go together
#     post_grad_city = models.ForeignKey('TigerBookCities', on_delete=models.RESTRICT, null=True, blank=False)
#     post_grad_country = models.ForeignKey('TigerBookCountries', on_delete=models.RESTRICT, null=True, blank=False)
#     interests = models.ManyToManyField('TigerBookInterests', related_name='shared_people', null=True, blank=False)
#     # TODO: the two below go together
#     extracurriculars = models.ManyToManyField('TigerBookExtracurriculars', related_name='shared_people', null=True,
#                                               blank=False)
#     extracurricular_positions = models.ManyToManyField('TigerBookExtracurricularPositions',
#                                                        related_name='shared_people', null=True, blank=False)
#     # TODO: the two below go together
#     research_types = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     research_titles = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     # TODO: the two below go together
#     miscellaneous_titles = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     miscellaneous_descriptions = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#
#
# class UndergraduateAlumniTigerBookDirectoryPermissions(models.Model):
#     # TODO: customize visibility at the attribute level
#     tigerbook_entry = models.OneToOneField(UndergraduateAlumniTigerBookDirectory, on_delete=models.RESTRICT, null=False,
#                                            related_name="tigerbook_directory_entry")
#     # TODO: add more general control for tigerbook listed users
#     # Default should be true
#     is_visible_to_undergrads = models.BooleanField(null=False, default=True)
#     # Default should be true
#     is_visible_to_faculty = models.BooleanField(null=False, default=True)
#     # Default should be true
#     is_visible_to_service_accounts = models.BooleanField(null=False, default=True)
#     # Default should be false
#     is_visible_to_graduate_students = models.BooleanField(null=False, default=True)
#     # Default should be false
#     is_visible_to_alumni = models.BooleanField(null=False, default=False)
#     # Default should be false
#     is_visible_to_staff = models.BooleanField(null=False, default=False)
#     # TODO: add finer control over which usernames get to see which fields, tigerbook listed users
#     # TODO: can add any username
#     profile_pic_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     track_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     concentration_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     class_year_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     aliases_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     pronouns_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     certificates_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     home_location_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
#     post_grad_location_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True,
#                                                          blank=False)
#     interests_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True,
#                                                 blank=False)
#     extracurriculars_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True,
#                                                        blank=False)
#     research_prohibited_usernames = ArrayField(base_field=models.TextField(blank=False), null=True,
#                                                blank=False)


class GenericTigerBookDirectory(models.Model):
    tigerbook_directory_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    tigerbook_directory_username = models.TextField(null=False, blank=False)
    tigerbook_directory_entry_object_id = models.CharField(default=uuid.uuid4, max_length=36)
    tigerbook_entry = GenericForeignKey('tigerbook_directory_type', 'tigerbook_directory_entry_object_id')

    class Meta:
        indexes = [
            models.Index(fields=["tigerbook_directory_type", "tigerbook_directory_username"]),
        ]


class TigerBookNotes(models.Model):
    # TODO: Current behavior -> when netIDs are deleted, directory entries are deleted with "CASCADE"
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    # TODO: individual note-taking, basic user is tied to User table
    notes_taking_user = models.ForeignKey(User, on_delete=models.RESTRICT, null=False,
                                          related_name="notes")
    # TODO: must map to existing, target tigerbook listed users
    target_directory_entries = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                          blank=True)
    # target_directory_entry = models.ForeignKey(GenericTigerBookDirectory, on_delete=models.RESTRICT, null=False,
    #                                            related_name='target_directory_entry_notes')
    shared_usernames = ArrayField(base_field=models.TextField(blank=False, null=True), default=list,
                                  blank=True)
    note_title = models.TextField()
    note_description = models.TextField()


# class TigerBookGroupNotes(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4)
#     # TODO: group notes taking user is tied to User table
#     group_notes_taking_user = models.OneToOneField(User, on_delete=models.RESTRICT, null=False,
#                                                    related_name="group_notes_creator")
#     target_directory_entries = models.ManyToManyField(GenericTigerBookDirectory,
#                                                       related_name='target_directory_entries_notes')
#     # a user can be associated with many group notes entries, and a group notes entry can be
#     # associated with many users
#     shared_with_users = models.ManyToManyField(User, related_name='group_notes')
#     note = models.TextField()


# TODO: The tables below have fields that need to be approved (those that need approval will be shown in the admin
#   dashboard)
class UndergraduateToBeApprovedCategories(models.Model):
    category = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.category


class UndergraduateToBeApprovedSubmissions(models.Model):
    category = models.ForeignKey(UndergraduateToBeApprovedCategories, on_delete=models.CASCADE)
    submission_username = models.TextField(null=False, blank=False)
    submission_field_one = models.TextField(null=False, blank=False)
    submission_field_two = models.TextField(null=True, blank=False)
    submission_field_three = models.TextField(null=True, blank=False)
    date_submitted = models.DateField(auto_now_add=True)
    approved = models.BooleanField(default=False)
    date_approved = models.DateField(null=True, blank=True)
    extracurricular_image_field = models.FileField(storage=PrivateTigerBookExtracurricularsMediaStorage(),
                                                   null=True)

    def __repr__(self):
        return f"{self.submission_field_one}, " \
               f"{self.submission_field_two}, " \
               f"{self.submission_field_three} " \
               f"({self.category}) submitted by {self.submission_username} on {self.date_submitted}"


class UndergraduateTigerBookTracks(models.Model):
    track = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.track


class UndergraduateTigerBookConcentrations(models.Model):
    concentration = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.concentration


class UndergraduateTigerBookClassYears(models.Model):
    class_year = models.IntegerField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.class_year


class UndergraduateTigerBookResidentialColleges(models.Model):
    residential_college = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.residential_college


class TigerBookPronouns(models.Model):
    pronouns = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.pronouns


class UndergraduateTigerBookCertificates(models.Model):
    certificate = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.certificate


class UndergraduateTigerBookHousing(models.Model):
    building = models.TextField(null=False, blank=False)
    room_no = models.TextField(null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return f"{self.building} {self.room_no}"

    @property
    def complete_housing(self):
        return self.building + ", " + self.room_no


class TigerBookCities(models.Model):
    city = models.TextField(null=False, blank=False)
    admin_name = models.TextField(null=False, blank=True)
    country = models.TextField(null=False, blank=False)
    latitude = models.FloatField(default=0)
    longitude = models.FloatField(default=0)
    date_added = models.DateField(auto_now_add=True)
    entire_location_string = models.TextField(null=False, blank=False)

    @property
    def complete_city(self):
        if self.admin_name == "":
            return self.city + ", " + self.country
        return self.city + ", " + self.admin_name + ", " + self.country

    def __repr__(self):
        return f"{self.city}, {self.admin_name}, {self.country}"


class TigerBookResearchTypes(models.Model):
    research_type = models.TextField(null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.research_type


class TigerBookInterests(models.Model):
    interest = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.interest


class TigerBookExtracurricularSubgroups(models.Model):
    subgroup = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.subgroup


class TigerBookExtracurriculars(models.Model):
    extracurricular = models.TextField(unique=True, null=False, blank=False)
    subgroup = models.ForeignKey(TigerBookExtracurricularSubgroups, on_delete=models.RESTRICT, null=False, blank=False)
    image_url = models.FileField(storage=PrivateTigerBookExtracurricularsMediaStorage(),
                                 null=True)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return f"{self.extracurricular} ({self.subgroup})"


class TigerBookExtracurricularPositions(models.Model):
    position = models.TextField(unique=True, null=False, blank=False)
    date_added = models.DateField(auto_now_add=True)

    def __repr__(self):
        return self.position

# class GraduateTigerBookDepartment(models.Model):
#     department = models.TextField(unique=True, null=False, blank=False)
#     date_added = models.DateField(auto_now_add=True)
#
#
# class GraduateTigerBookPrograms(models.Model):
#     program = models.TextField(unique=True, null=False, blank=False)
#     date_added = models.DateField(auto_now_add=True)
#
#
# class GraduateTigerBookGraduationYears(models.Model):
#     class_year = models.IntegerField(unique=True, null=False, blank=False)
#     date_added = models.DateField(auto_now_add=True)
#
#
# class GraduateTigerBookCertificates(models.Model):
#     certificate = models.TextField(unique=True, null=False, blank=False)
#     date_added = models.DateField(auto_now_add=True)
