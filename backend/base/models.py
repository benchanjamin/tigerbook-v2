from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField
import uuid


class ActiveDirectoryAPI(models.Model):
    net_id = models.TextField()
    full_name = models.TextField()
    puid = models.TextField()
    email = models.EmailField()
    pu_status = models.TextField()
    department = models.TextField()


class ResidentialCollegeFacebook(models.Model):
    full_name = models.TextField()
    email = models.EmailField()
    track = models.TextField()
    concentration = models.TextField()
    class_year = models.IntegerField()
    res_college = models.TextField()


class TigerBookNetIDs(models.Model):
    net_id = models.TextField(db_index=True, null=False)


class TigerBookDirectory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    # TODO: Current behavior -> when netIDs are deleted, directory entries are deleted with "CASCADE"
    net_id = models.ForeignKey('TigerBookNetIDs', on_delete=models.CASCADE, null=False)
    email = models.EmailField(db_index=True, null=False)
    puid = models.TextField(db_index=True, null=False)
    full_name = models.TextField(db_index=True, null=False)
    # Default should be true
    is_visible_to_undergrads = models.BooleanField(null=False, default=True)
    # Default should be true
    is_visible_to_faculty = models.BooleanField(null=False, default=True)
    # Default should be false
    is_visible_to_graduate_students = models.BooleanField(null=False, default=False)
    # Default should be false
    is_visible_to_alumni = models.BooleanField(null=False, default=False)
    # TODO: All the below fields are nullable
    # prohibited_net_ids = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    prohibited_net_ids = models.ManyToManyField('TigerBookNetIDs', related_name='+', null=True, blank=False)
    profile_picture_url = models.URLField(null=True)
    track = models.ForeignKey('TigerBookTracks', on_delete=models.RESTRICT, null=True)
    concentration = models.ForeignKey('TigerBookConcentrations', on_delete=models.RESTRICT, null=True)
    class_year = models.ForeignKey('TigerBookClassYears', on_delete=models.RESTRICT, null=True)
    res_college = models.ForeignKey('TigerBookResidentialColleges', on_delete=models.RESTRICT, null=True)
    housing = models.TextField(null=True)
    # TODO: maybe change housing_roommates to have foreign keys (ManyToManyField) to TigerBooNetIDs?
    housing_roommates = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    aliases = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    pronouns = models.ManyToManyField('TigerBookPronouns', related_name='shared_people', null=True, blank=False)
    certificates = models.ManyToManyField('TigerBookCertificates', related_name='shared_people', null=True,
                                          blank=False)
    home_cities = models.ManyToManyField('TigerBookCities', related_name='shared_people', null=True, blank=False)
    home_countries = models.ManyToManyField('TigerBookCountries', related_name='shared_people', null=True,
                                            blank=False)
    post_grad_city = models.ForeignKey('TigerBookCities', on_delete=models.RESTRICT, null=True, blank=False)
    post_grad_country = models.ForeignKey('TigerBookCountries', on_delete=models.RESTRICT, null=True, blank=False)
    interests = models.ManyToManyField('TigerBookInterests', related_name='shared_people', null=True, blank=False)
    extracurriculars = models.ManyToManyField('TigerBookExtracurriculars', related_name='shared_people', null=True,
                                              blank=False)
    extracurricular_positions = models.ManyToManyField('TigerBookExtracurricularPositions',
                                                       related_name='shared_people', null=True, blank=False)
    research_types = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    research_titles = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    miscellaneous_attributes = ArrayField(base_field=models.TextField(blank=False), null=True, blank=False)
    date_joined = models.DateField(auto_now_add=True)
    # TODO: customize visibility at the attribute level


class TigerBookIndividualNotes(models.Model):
    # TODO: Current behavior -> when netIDs are deleted, directory entries are deleted with "CASCADE"
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    source_net_id = models.ForeignKey(TigerBookNetIDs, on_delete=models.CASCADE, null=False,
                                      related_name='source_net_id_individual')
    target_net_id = models.ForeignKey(TigerBookNetIDs, on_delete=models.CASCADE, null=False,
                                      related_name='target_net_id_individual')
    note = models.TextField()


class TigerBookGroupNotes(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    source_net_id = models.ForeignKey(TigerBookNetIDs, on_delete=models.CASCADE, null=False,
                                      related_name='source_net_id_group')
    target_net_ids = models.ManyToManyField(TigerBookNetIDs, related_name='target_net_ids_group')
    shared_net_ids = models.ManyToManyField(TigerBookNetIDs, related_name='shared_group')
    note = models.TextField()


# The tables below have fields that need to be approved (those that need approval will be shown in the admin
# dashboard)
class TigerBookTracks(models.Model):
    track = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False, blank=False, null=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookConcentrations(models.Model):
    concentration = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False, blank=False, null=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookClassYears(models.Model):
    class_years = models.IntegerField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False, blank=False, null=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookResidentialColleges(models.Model):
    residential_colleges = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False, blank=False, null=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookPronouns(models.Model):
    pronouns = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookCertificates(models.Model):
    certificates = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookCountries(models.Model):
    countries = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookCities(models.Model):
    cities = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookInterests(models.Model):
    interests = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookExtracurriculars(models.Model):
    extracurriculars = models.TextField(unique=True, null=False, blank=False)
    subgroup = models.ForeignKey('TigerBookClassYears', on_delete=models.CASCADE, null=True, blank=False)
    image_url = models.URLField(unique=False, null=True, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookExtracurricularsSubgroup(models.Model):
    subgroup = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)


class TigerBookExtracurricularPositions(models.Model):
    positions = models.TextField(unique=True, null=False, blank=False)
    approved = models.BooleanField(default=False)
    date_added = models.DateField(auto_now_add=True)
