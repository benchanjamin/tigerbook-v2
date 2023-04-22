import contextlib
import datetime
import re

from django.db.models import Q
from django.urls import reverse
from rest_framework import serializers
import itertools

from active_directory.req_lib import ReqLib
from base.models import (
    UndergraduateTigerBookDirectory,
    UndergraduateTigerBookTracks,
    UndergraduateTigerBookConcentrations,
    UndergraduateTigerBookCertificates,
    TigerBookPronouns,
    TigerBookCities,
    UndergraduateTigerBookDirectoryPermissions,
    UndergraduateTigerBookResidentialColleges, TigerBookInterests, TigerBookExtracurriculars,
    TigerBookExtracurricularPositions, TigerBookResearchTypes,
    UndergraduateTigerBookHousing, TigerBookNotes, GenericTigerBookDirectory, CASProfile,
    UndergraduateToBeApprovedSubmissions, UndergraduateToBeApprovedCategories, TigerBookExtracurricularSubgroups,
    UndergraduateTigerBookClassYears
)
from base.utils import get_display_username
from drf_writable_nested.serializers import WritableNestedModelSerializer
from django.contrib.auth.models import User


class UndergraduateConcentrationsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookConcentrations
        fields = [
            'concentration'
        ]


class UndergraduateClassYearsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookClassYears
        fields = [
            'class_year'
        ]


class UndergraduateResidentialCollegesListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookResidentialColleges
        fields = [
            'residential_college'
        ]


class CitiesListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = TigerBookCities
        fields = [
            'complete_city'
        ]


class UndergraduateCertificatesListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookCertificates
        fields = [
            'certificate'
        ]


class UndergraduateTracksListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookTracks
        fields = [
            'track'
        ]


class PronounsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = TigerBookPronouns
        fields = [
            'pronouns'
        ]


class InterestsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = TigerBookInterests
        fields = [
            'interest'
        ]


class ExtracurricularsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = TigerBookExtracurriculars
        fields = [
            'extracurricular'
        ]


class ExtracurricularsPositionsListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = TigerBookExtracurricularPositions
        fields = [
            'position'
        ]


class HousingListAPISerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookHousing
        fields = [
            'complete_housing'
        ]


class TigerBookMiscellaneousSerializer(serializers.Serializer):
    miscellaneous_title = serializers.CharField(allow_null=False)
    miscellaneous_description = serializers.CharField(allow_null=False)

    def validate_miscellaneous_description(self, miscellaneous_description):
        hyperlink_regex = re.compile(
            r'\b(?:https?|telnet|gopher|file|wais|ftp):[\w/#~:.?+=&%@!\-.:?\\-]+?(?=[.:?\-]*(?:['
            r'^\w/#~:.?+=&%@!\-.:?\-]|$))')
        html_tags_regex = re.compile(r'<.*?>')
        if hyperlink_regex.match(miscellaneous_description) or html_tags_regex.match(miscellaneous_description):
            raise serializers.ValidationError("Miscellaneous description contains a hyperlink or html tag.")
        return miscellaneous_description


class TigerBookCitiesSerializer(serializers.RelatedField):
    def get_queryset(self):
        return TigerBookCities.objects.all()

    # TODO: referenced
    #  https://stackoverflow.com/questions/35257698/what-is-serializers-to-internal-value-method-used-for-in-django
    def to_internal_value(self, complete_city):
        # data is the city str, e.g. "Fort Worth, Texas, United States"
        # enforce that the data type is a string
        if not isinstance(complete_city, str):
            raise serializers.ValidationError(
                'City location must be a string.'
            )
        try:
            return self.get_queryset().get(entire_location_string=complete_city)
        except TigerBookCities.DoesNotExist as exception:
            raise serializers.ValidationError(
                'TigerBookCities object does not exist.'
            ) from exception

    def to_representation(self, value):
        if hasattr(value, "admin_name") and value.admin_name != "":
            return f"{value.city}, {value.admin_name}, {value.country}"
        return f"{value.city}, {value.country}"


class TigerBookNotesTargetDirectoryEntriesSerializer(serializers.RelatedField):
    def get_queryset(self):
        return GenericTigerBookDirectory.objects.all()

    def to_internal_value(self, data):
        # data is the username str, e.g. "bychan"
        # enforce that the data type is a string
        if not isinstance(data, str):
            raise serializers.ValidationError(
                'Username must be a string.'
            )
        try:
            return GenericTigerBookDirectory.objects.get(username=data)
        except GenericTigerBookDirectory.DoesNotExist as exception:
            raise serializers.ValidationError(
                'GenericTigerBookDirectory object does not exist.'
            ) from exception

    def to_representation(self, value):
        return {"username": value.username, "profile_pic_url": value.profile_pic_url}


class TigerBookExtracurricularSerializer(serializers.Serializer):
    extracurricular = serializers.CharField(allow_null=False)
    positions = serializers.ListField(child=serializers.CharField(allow_blank=False, allow_null=False))

    def validate_extracurricular(self, extracurricular):
        if not TigerBookExtracurriculars.objects.filter(extracurricular__iexact=extracurricular).exists():
            raise serializers.ValidationError(f"Specified extracurricular {extracurricular} does not exist")
        return extracurricular

    def validate_positions(self, positions):
        for position in positions:
            if not TigerBookExtracurricularPositions.objects.filter(position__iexact=position).exists():
                raise serializers.ValidationError(f"Specified position {position} does not exist")
        return positions


class TigerBookResearchSerializer(serializers.Serializer):
    research_type = serializers.CharField(allow_null=False)
    research_title = serializers.CharField(allow_null=False)

    def validate_research_type(self, research_type):
        if not TigerBookResearchTypes.objects.filter(research_type__iexact=research_type).exists():
            raise serializers.ValidationError(f"Specified extracurricular {research_type} does not exist")
        return research_type

    def validate_research_title(self, research_title):
        hyperlink_regex = re.compile(
            r'\b(?:https?|telnet|gopher|file|wais|ftp):[\w/#~:.?+=&%@!\-.:?\\-]+?(?=[.:?\-]*(?:['
            r'^\w/#~:.?+=&%@!\-.:?\-]|$))')
        html_tags_regex = re.compile(r'<.*?>')
        if hyperlink_regex.match(research_title) or html_tags_regex.match(research_title):
            raise serializers.ValidationError("Research title contains a hyperlink or html tags.")
        return research_title


class PermissionsSerializer(WritableNestedModelSerializer):
    # Default should be true
    is_visible_to_undergrads = serializers.BooleanField(required=False)
    # Default should be true
    is_visible_to_faculty = serializers.BooleanField(required=False)
    # Default should be true
    is_visible_to_service_accounts = serializers.BooleanField(required=False)
    # Default should be false
    is_visible_to_graduate_students = serializers.BooleanField(required=False)
    # Default should be false
    # is_visible_to_alumni = serializers.BooleanField()
    # Default should be false
    is_visible_to_staff = serializers.BooleanField(required=False)
    username_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                          child=serializers.CharField(allow_blank=False,
                                                                                      allow_null=False),
                                                          required=False)
    profile_pic_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                             child=serializers.CharField(allow_blank=False,
                                                                                         allow_null=False),
                                                             required=False)
    track_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                       child=serializers.CharField(allow_blank=False,
                                                                                   allow_null=False), required=False)
    concentration_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                               child=serializers.CharField(allow_blank=False,
                                                                                           allow_null=False),
                                                               required=False)
    class_year_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                            child=serializers.CharField(allow_blank=False,
                                                                                        allow_null=False),
                                                            required=False)
    residential_college_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                                     child=serializers.CharField(allow_blank=False,
                                                                                                 allow_null=False),
                                                                     required=False)
    housing_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                         child=serializers.CharField(allow_blank=False,
                                                                                     allow_null=False)
                                                         , required=False)
    aliases_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                         child=serializers.CharField(allow_blank=False,
                                                                                     allow_null=False), required=False)
    pronouns_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                          child=serializers.CharField(allow_blank=False,
                                                                                      allow_null=False), required=False)
    certificates_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                              child=serializers.CharField(allow_blank=False,
                                                                                          allow_null=False),
                                                              required=False)
    hometown_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                          child=serializers.CharField(allow_blank=False,
                                                                                      allow_null=False),
                                                          required=False)
    current_city_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                              child=serializers.CharField(allow_blank=False,
                                                                                          allow_null=False),
                                                              required=False)
    interests_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                           child=serializers.CharField(allow_blank=False,
                                                                                       allow_null=False),
                                                           required=False)
    extracurriculars_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                                  child=serializers.CharField(allow_blank=False,
                                                                                              allow_null=False),
                                                                  required=False)
    research_prohibited_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                                          child=serializers.CharField(allow_blank=False,
                                                                                      allow_null=False),
                                                          required=False)

    class Meta:
        model = UndergraduateTigerBookDirectoryPermissions
        exclude = ['id']

    def validate(self, data):
        usernames = itertools.chain(
            data['username_prohibited_usernames'], data['profile_pic_prohibited_usernames'],
            data['track_prohibited_usernames'], data['concentration_prohibited_usernames'],
            data['class_year_prohibited_usernames'],
            data['residential_college_prohibited_usernames'],
            data['housing_prohibited_usernames'], data['aliases_prohibited_usernames'],
            data['pronouns_prohibited_usernames'], data['certificates_prohibited_usernames'],
            data['hometown_prohibited_usernames'],
            data['current_city_prohibited_usernames'],
            data['interests_prohibited_usernames'],
            data['extracurriculars_prohibited_usernames'],
            data['research_prohibited_usernames'])
        for username in usernames:
            if not isinstance(username, str):
                raise serializers.ValidationError(
                    'Username must be a string.'
                )
            req_lib = ReqLib()
            if User.objects.filter(username__iexact=username).exists() or \
                    CASProfile.objects.filter(net_id__iexact=username).exists() or \
                    req_lib.get_info_for_tigerbook(username):
                return data
            raise serializers.ValidationError(
                f'User with username {username} does not exist.'
            )


# Serializers below are for the initial user setup page

class ActiveDirectorySetupSerializer(serializers.Serializer):
    full_name = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    # department = serializers.CharField(read_only=True)


class ResidentialCollegeSetupSerializer(serializers.Serializer):
    photo_url = serializers.SerializerMethodField(read_only=True)

    def get_photo_url(self, obj):
        return obj.residential_college_picture_url.url


class PhotoUploadSetupSerializer(serializers.Serializer):
    photo_url = serializers.ImageField()


# Serializers below are for the user profile page


# Serializers below are view-specific to urls in api Django app

class TigerBookHeaderSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    has_profile = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username',
                  'profile_pic_url',
                  'has_profile']

    def get_username(self, obj):
        return get_display_username(obj.username)

    def get_profile_pic_url(self, obj):
        if not hasattr(obj, 'undergraduate_tigerbook_directory_entry'):
            return None
        directory = obj.undergraduate_tigerbook_directory_entry
        if directory.profile_pic:
            return directory.profile_pic.url
        elif hasattr(directory, 'residential_college_facebook_entry'):
            if directory.residential_college_facebook_entry is None:
                return None
            return directory.residential_college_facebook_entry.residential_college_picture_url.url
        else:
            return None

    def get_has_profile(self, obj):
        # TODO: add more checks for alums and grad students
        if hasattr(obj, 'undergraduate_tigerbook_directory_entry'):
            return True
        else:
            return False


class TigerBookMapSerializer(serializers.ModelSerializer):
    count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TigerBookCities
        fields = [
            'complete_city',
            'count',
            'latitude',
            'longitude'
        ]

    def get_count(self, obj):
        return obj.undergraduates_hometown.count()


# TODO: This is personal account information for setup, or initial page
class UndergraduateTigerBookDirectorySetupFirstPageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    active_directory_entry = ActiveDirectorySetupSerializer(read_only=True)
    residential_college_facebook_entry = ResidentialCollegeSetupSerializer(read_only=True)
    # 'concentration' and 'track' are required fields, hence allow_empty=False and allow_null=False
    concentration = serializers.SlugRelatedField(slug_field='concentration',
                                                 queryset=UndergraduateTigerBookConcentrations.objects.all(),
                                                 allow_null=False)
    track = serializers.SlugRelatedField(slug_field='track', queryset=UndergraduateTigerBookTracks.objects.all(),
                                         allow_null=False)
    aliases = serializers.ListField(allow_empty=True, allow_null=False, child=serializers.CharField(allow_blank=False),
                                    required=False)
    hometown = TigerBookCitiesSerializer(required=False, allow_null=True)
    certificates = serializers.SlugRelatedField(many=True, slug_field='certificate',
                                                queryset=UndergraduateTigerBookCertificates.objects.all(),
                                                allow_null=False,
                                                required=False)
    pronouns = serializers.SlugRelatedField(slug_field='pronouns',
                                            queryset=TigerBookPronouns.objects.all(),
                                            allow_null=True,
                                            required=False)
    class_year = serializers.SlugRelatedField(slug_field='class_year',
                                              queryset=UndergraduateTigerBookClassYears.objects.all(),
                                              allow_null=False)
    residential_college = serializers.SlugRelatedField(slug_field='residential_college',
                                                       queryset=UndergraduateTigerBookResidentialColleges.objects.all(),
                                                       allow_null=False)
    profile_pic = serializers.FileField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'active_directory_entry',
            'residential_college_facebook_entry',
            'aliases',
            # the following below are ForeignKey fields in models
            'concentration',
            'track',
            'pronouns',
            # the following below are ManyToMany fields in models
            'hometown',
            'certificates',
            # the following below are read-only
            'class_year',
            'residential_college',
            'profile_pic'
        ]

    def get_username(self, obj):
        return get_display_username(obj.user.username)

    def update(self, instance, validated_data):
        instance.has_setup_profile.has_setup_page_one = True
        instance.has_setup_profile.save()
        return super().update(instance, validated_data)


class UndergraduateTigerBookDirectorySetupSecondPageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    profile_pic = serializers.FileField(allow_null=True, required=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'profile_pic'
        ]

    def get_username(self, obj):
        return get_display_username(obj.user.username)

    # TODO: https://stackoverflow.com/questions/29373983/remove-a-file-in-amazon-s3-using-django-storages
    #   to delete old profile pic on
    def update(self, instance, validated_data):
        with contextlib.suppress(ValueError):
            # if profile pic exists before (going through setup page two twice)
            if instance.profile_pic.url:
                instance.profile_pic.delete(save=False)
        instance.has_setup_profile.has_setup_page_two = True
        instance.has_setup_profile.save()
        # extra
        return super().update(instance, validated_data)


# TODO: This is personal account information for profile page


class UndergraduateTigerBookHousingSerializer(serializers.RelatedField):
    def get_queryset(self):
        return UndergraduateTigerBookHousing.objects.all()

    # TODO: referenced
    #  https://stackoverflow.com/questions/35257698/what-is-serializers-to-internal-value-method-used-for-in-django
    def to_internal_value(self, data):
        # data is the room str, e.g. "FORBES, 307"
        # enforce that the data type is a string
        if not isinstance(data, str):
            raise serializers.ValidationError(
                'Housing must be a string.'
            )
        data = data.split(", ")
        try:
            if len(data) != 2:
                raise serializers.ValidationError(
                    'Entered # of commas is not 1 followed by a space for a housing location')
            building, room_no = data
            return UndergraduateTigerBookHousing.objects.get(building__iexact=building, room_no=room_no)
        except TigerBookCities.DoesNotExist as exception:
            raise serializers.ValidationError(
                'UndergraduateTigerBookHousing object does not exist.'
            ) from exception

    def to_representation(self, value):
        return f"{value.building.capitalize()}, {value.room_no}"


class UndergraduateTigerBookDirectoryProfileFullSerializer(WritableNestedModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    active_directory_entry = ActiveDirectorySetupSerializer(read_only=True)
    residential_college_facebook_entry = ResidentialCollegeSetupSerializer(read_only=True)
    # 'concentration' and 'track' are required fields, hence allow_empty=False and allow_null=False
    concentration = serializers.SlugRelatedField(slug_field='concentration',
                                                 queryset=UndergraduateTigerBookConcentrations.objects.all(),
                                                 allow_null=False, required=False)
    track = serializers.SlugRelatedField(slug_field='track', queryset=UndergraduateTigerBookTracks.objects.all(),
                                         allow_null=False, required=False)
    aliases = serializers.ListField(allow_empty=True, allow_null=False, required=False,
                                    child=serializers.CharField(allow_blank=False))
    hometown = TigerBookCitiesSerializer(allow_null=True, required=False)
    current_city = TigerBookCitiesSerializer(allow_null=True, required=False)
    certificates = serializers.SlugRelatedField(many=True, slug_field='certificate',
                                                queryset=UndergraduateTigerBookCertificates.objects.all(),
                                                allow_null=False, required=False)
    pronouns = serializers.SlugRelatedField(slug_field='pronouns',
                                            queryset=TigerBookPronouns.objects.all(),
                                            allow_null=True, required=False)
    # # new fields are below compared to setup profile
    # TODO: prev default profile pic should be of res college facebook or None
    profile_pic = serializers.FileField(allow_null=True, required=False)
    permissions = PermissionsSerializer(required=False)
    class_year = serializers.SlugRelatedField(slug_field='class_year',
                                              read_only=True)
    residential_college = serializers.SlugRelatedField(slug_field='residential_college',
                                                       queryset=UndergraduateTigerBookResidentialColleges.objects.all(),
                                                       allow_null=False,
                                                       required=False)
    housing = UndergraduateTigerBookHousingSerializer(allow_null=True, required=False)

    interests = serializers.SlugRelatedField(many=True, slug_field='interest',
                                             queryset=TigerBookInterests.objects.all(),
                                             allow_null=False,
                                             required=False)
    # TODO: below fields cannot be null, must be empty array [] at least
    extracurriculars = serializers.JSONField(allow_null=False, required=False)
    research = serializers.JSONField(allow_null=False, required=False)
    miscellaneous = serializers.JSONField(allow_null=False, required=False)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'active_directory_entry',
            'residential_college_facebook_entry',
            'permissions',
            'profile_pic',
            'track',
            'concentration',
            'class_year',
            'residential_college',
            'housing',
            'aliases',
            'pronouns',
            'certificates',
            'hometown',
            'current_city',
            'interests',
            'extracurriculars',
            'research',
            'miscellaneous',
        ]

    def get_username(self, obj):
        return get_display_username(obj.user.username)

    def update(self, instance, validated_data):
        with contextlib.suppress(ValueError):
            # TODO: only change profile pic if profile pic is in validated data (i.e,
            #  if user is not including profile pic in post request, then don't delete the old one)
            if instance.profile_pic.url and 'profile_pic' in validated_data:
                instance.profile_pic.delete(save=False)
        # delete existing extracurriculars
        instance.extracurricular_objs.clear()
        instance.extracurricular_position_objs.clear()
        # add extracurriculars
        if instance.extracurriculars is None:
            return super().update(instance, validated_data)
        for extracurricular in instance.extracurriculars:
            extracurricular_title = extracurricular['extracurricular']
            retrieved_extracurricular = TigerBookExtracurriculars.objects.get(extracurricular=extracurricular_title)
            instance.extracurricular_objs.add(retrieved_extracurricular)
            retrieved_positions_list = []
            for position in extracurricular['positions']:
                retrieved_position = TigerBookExtracurricularPositions.objects.get(position=position)
                # instance.extracurricular_position_objs.add(retrieved_position)
                retrieved_positions_list.append(retrieved_position)
            instance.extracurricular_position_objs.add(*retrieved_positions_list)
        return super().update(instance, validated_data)

    # TODO: referenced https://stackoverflow.com/questions/56025763/serializer-for-jsonfield-nested-representation
    def validate_extracurriculars(self, extracurriculars):
        if type(extracurriculars) is not list:
            raise serializers.ValidationError("Extracurriculars field is not an array.")
        for extracurricular in extracurriculars:
            serializer = TigerBookExtracurricularSerializer(data=extracurricular)
            serializer.is_valid(raise_exception=True)
        return extracurriculars

    def validate_research(self, research):
        if type(research) is not list:
            raise serializers.ValidationError("Research field is not an array.")
        for research_entity in research:
            serializer = TigerBookResearchSerializer(data=research_entity)
            serializer.is_valid(raise_exception=True)
        return research

    def validate_miscellaneous(self, miscellaneous):
        if type(miscellaneous) is not list:
            raise serializers.ValidationError("Miscellaneous field is not an array.")
        for miscellaneous_entity in miscellaneous:
            serializer = TigerBookMiscellaneousSerializer(data=miscellaneous_entity)
            serializer.is_valid(raise_exception=True)
        return miscellaneous


class UndergraduateTigerBookDirectoryListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField(read_only=True)
    username = serializers.SerializerMethodField(read_only=True)
    track = serializers.SerializerMethodField(read_only=True)
    concentration = serializers.SerializerMethodField(read_only=True)
    class_year = serializers.SerializerMethodField(read_only=True)
    residential_college = serializers.SerializerMethodField(read_only=True)
    pronouns = serializers.SerializerMethodField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'full_name',
            'track',
            'concentration',
            'class_year',
            'residential_college',
            'pronouns',
            'profile_pic_url',
            'url',
        ]

    def get_url(self, obj):
        if hasattr(obj.user, 'cas_profile'):
            return reverse('undergraduate-retrieve', kwargs={'username': obj.user.cas_profile.net_id})
        return reverse('undergraduate-retrieve', kwargs={'username': obj.user.username})

    def get_full_name(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        return obj.active_directory_entry.full_name

    def get_username(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile') and request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
            return None
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        if hasattr(obj.user, 'cas_profile'):
            return obj.user.cas_profile.net_id
        return obj.username

    def get_track(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions.track_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.track_prohibited_usernames:
            return None
        return obj.track.track if hasattr(obj.track, 'track') else None

    def get_concentration(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions.concentration_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.concentration_prohibited_usernames:
            return None
        if hasattr(obj.concentration, 'concentration'):
            return obj.concentration.concentration
        return None

    def get_class_year(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions.class_year_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.class_year_prohibited_usernames:
            return None
        if hasattr(obj.class_year, 'class_year'):
            return obj.class_year.class_year
        return None

    def get_residential_college(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions. \
                    residential_college_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.residential_college_prohibited_usernames:
            return None
        if hasattr(obj.residential_college, 'residential_college'):
            return obj.residential_college.residential_college
        return None

    def get_pronouns(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions. \
                    pronouns_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.pronouns_prohibited_usernames:
            return None
        return obj.pronouns.pronouns if hasattr(obj.pronouns, 'pronouns') else None

    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if hasattr(request.user,
                   'cas_profile'):
            if request.user.cas_profile.net_id in obj.permissions.username_prohibited_usernames:
                return None
            if request.user.cas_profile.net_id in obj.permissions. \
                    profile_pic_prohibited_usernames:
                return None
        if request.user.username in obj.permissions.profile_pic_prohibited_usernames:
            return None
        if obj.profile_pic:
            return obj.profile_pic.url
        # TODO: check if this works with people who don't have a profile pic on residential college facebook
        elif hasattr(obj, 'residential_college_facebook_entry'):
            if obj.residential_college_facebook_entry is None:
                return None
            return obj.residential_college_facebook_entry.residential_college_picture_url.url
        else:
            return None


class UndergraduateTigerBookDirectorySearchSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'full_name',
        ]

    def get_username(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        return get_display_username(obj.user.username)

    def get_full_name(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        return obj.active_directory_entry.full_name


class UndergraduateTigerBookDirectoryRetrieveSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    full_name = serializers.SerializerMethodField(read_only=True)
    track = serializers.SerializerMethodField(read_only=True)
    concentration = serializers.SerializerMethodField(read_only=True)
    class_year = serializers.SerializerMethodField(read_only=True)
    residential_college = serializers.SerializerMethodField(read_only=True)
    pronouns = serializers.SerializerMethodField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)
    aliases = serializers.SerializerMethodField(read_only=True)
    certificates = serializers.SerializerMethodField(read_only=True)
    hometown = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'full_name',
            'track',
            'concentration',
            'class_year',
            'residential_college',
            'pronouns',
            'profile_pic_url',
            'aliases',
            'certificates',
            'hometown'
        ]

    def get_username(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        return get_display_username(obj.user.username)

    def get_full_name(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        return obj.active_directory_entry.full_name

    def get_track(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.track_prohibited_usernames:
            return None
        return obj.track.track if hasattr(obj.track, 'track') else None

    def get_concentration(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.concentration_prohibited_usernames:
            return None
        if hasattr(obj.concentration, 'concentration'):
            return obj.concentration.concentration
        return None

    def get_class_year(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.class_year_prohibited_usernames:
            return None
        if hasattr(obj.class_year, 'class_year'):
            return obj.class_year.class_year
        return None

    def get_residential_college(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.residential_college_prohibited_usernames:
            return None
        if hasattr(obj.residential_college, 'residential_college'):
            return obj.residential_college.residential_college
        return None

    def get_pronouns(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.pronouns_prohibited_usernames:
            return None
        return obj.pronouns.pronouns if hasattr(obj.pronouns, 'pronouns') else None

    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.profile_pic_prohibited_usernames:
            return None
        if obj.profile_pic:
            return obj.profile_pic.url
        # TODO: check if this works with people who don't have a profile pic on residential college facebook
        elif hasattr(obj, 'residential_college_facebook_entry'):
            if obj.residential_college_facebook_entry is None:
                return None
            return obj.residential_college_facebook_entry.residential_college_picture_url.url
        else:
            return None

    def get_aliases(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.aliases_prohibited_usernames:
            return None
        return obj.aliases if hasattr(obj, 'aliases') else None

    def get_certificates(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.certificates_prohibited_usernames:
            return None
        certificates = UndergraduateTigerBookCertificatesRetrieveSerializer(obj.certificates, many=True).data \
            if hasattr(obj, 'certificates') \
            else None
        result = []
        for certificate in certificates:
            result.append(certificate['certificate'])
        return result

    def get_hometown(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.hometown_prohibited_usernames:
            return None
        if hasattr(obj.hometown, 'complete_city'):
            return obj.hometown.complete_city
        return None


class TigerBookNotesListSerializer(serializers.ModelSerializer):
    note_title = serializers.CharField(read_only=True)
    note_description = serializers.CharField(allow_blank=True, allow_null=True, read_only=True)
    target_directory_entries = serializers.SerializerMethodField(read_only=True)
    update_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TigerBookNotes
        fields = [
            'note_title',
            'note_description',
            'target_directory_entries',
            'update_url',
        ]

    def get_update_url(self, obj):
        return reverse('individual-note-update', kwargs={'id': obj.id})

    def get_target_directory_entries(self, obj):
        request = self.context.get('request')
        tigerbook_directories = []
        for display_username in obj.target_directory_entries:
            lookup = Q(user__username__iexact=display_username) | Q(user__cas_profile__net_id__iexact=display_username)
            tigerbook_directories.append(UndergraduateTigerBookDirectory.objects.filter(lookup).first())
        return UndergraduateTigerBookDirectoryListSerializer(tigerbook_directories, many=True,
                                                             context={'request': request}).data


class TigerBookNotesCreateSerializer(serializers.ModelSerializer):
    note_title = serializers.CharField()
    note_description = serializers.CharField(allow_blank=True, allow_null=True)

    class Meta:
        model = TigerBookNotes
        fields = [
            'note_title',
            'note_description'
        ]


class UndergraduateTigerBookCertificatesRetrieveSerializer(serializers.ModelSerializer):
    certificate = serializers.CharField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookCertificates
        fields = [
            'certificate'
        ]


class TigerBookNotesUpdateSerializer(serializers.ModelSerializer):
    note_title = serializers.CharField()
    note_description = serializers.CharField(allow_blank=True, allow_null=True)
    # target_directory_entries = serializers.SlugRelatedField(slug_field='tigerbook_directory_username', many=True,
    #                                                         queryset=GenericTigerBookDirectory.objects.all(),
    #                                                         allow_null=False,
    #                                                         required=False)
    target_directory_entries = serializers.ListField(allow_empty=True, allow_null=False,
                                                     child=serializers.CharField(allow_blank=False,
                                                                                 allow_null=False), required=False)
    shared_usernames = serializers.ListField(allow_empty=True, allow_null=False,
                                             child=serializers.CharField(allow_blank=False,
                                                                         allow_null=False), required=False)

    class Meta:
        model = TigerBookNotes
        fields = [
            'note_title',
            'note_description',
            'target_directory_entries',
            'shared_usernames'
        ]

    def validate_shared_usernames(self, usernames):
        # if usernames isn't a list of strings, raise a validation error
        if not isinstance(usernames, list):
            raise serializers.ValidationError('shared_usernames must be a list of strings')
        for username in usernames:
            if not isinstance(username, str):
                raise serializers.ValidationError('shared_usernames must be a list of strings')
            req_lib = ReqLib()
            if not User.objects.filter(username__iexact=username).exists() and \
                    not CASProfile.objects.filter(net_id__iexact=username).exists() and \
                    not req_lib.get_info_for_tigerbook(username):
                raise serializers.ValidationError(
                    f'User with username {username} does not exist.'
                )
        return usernames


class UndergraduateToBeApprovedSubmissionsCreateSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field='category',
                                            queryset=UndergraduateToBeApprovedCategories.objects.all(),
                                            allow_null=False)
    submission_field_one = serializers.CharField(allow_blank=False,
                                                 allow_null=False,
                                                 required=True)
    submission_field_two = serializers.CharField(allow_blank=False,
                                                 allow_null=True,
                                                 required=False)
    submission_field_three = serializers.CharField(allow_blank=False,
                                                   allow_null=True,
                                                   required=False)
    extracurricular_image_field \
        = serializers.FileField(allow_null=True, required=False)

    class Meta:
        model = UndergraduateToBeApprovedSubmissions
        fields = [
            'category',
            'submission_field_one',
            'submission_field_two',
            'submission_field_three',
            'extracurricular_image_field'
        ]

    def create(self, validated_data):
        request = self.context.get('request')
        instance = super().create(validated_data)
        instance.submission_username = get_display_username(request.user.username)
        category = instance.category.category
        match category:
            case 'track':
                instance.submission_field_one = validated_data.pop('submission_field_one').upper().strip()
            case 'concentration':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'residential_college':
                instance.submission_field_one = validated_data.pop('submission_field_one').capitalize().strip()
            case 'certificate':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'research_type':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'interest':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'extracurricular_subgroup':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'extracurricular_position':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
            case 'housing':
                instance.submission_field_one = validated_data.pop('submission_field_one').capitalize().strip()
                instance.submission_field_two = validated_data.pop('submission_field_two').capitalize().strip()
            case 'city':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
                instance.submission_field_two = validated_data.pop('submission_field_two').strip()
                instance.submission_field_three = validated_data.pop('submission_field_three').strip()
            case 'extracurricular':
                instance.submission_field_one = validated_data.pop('submission_field_one').strip()
                instance.submission_field_two = validated_data.pop('submission_field_two').strip()
        instance.save()
        return instance


class UndergraduateToBeApprovedSubmissionsListSerializer(serializers.ModelSerializer):
    submission_username = serializers.CharField(read_only=True)
    category = serializers.SlugRelatedField(slug_field='category', read_only=True)
    submission_field_one = serializers.CharField(read_only=True)
    submission_field_two = serializers.CharField(read_only=True)
    submission_field_three = serializers.CharField(read_only=True)
    date_submitted = serializers.DateField(read_only=True)
    approved = serializers.BooleanField(read_only=True)
    date_approved = serializers.DateField(read_only=True)
    approve_url = serializers.SerializerMethodField(read_only=True)
    delete_url = serializers.SerializerMethodField(read_only=True)
    extracurricular_image_field \
        = serializers.FileField(read_only=True)

    class Meta:
        model = UndergraduateToBeApprovedSubmissions
        fields = [
            'submission_username',
            'category',
            'submission_field_one',
            'submission_field_two',
            'submission_field_three',
            'date_submitted',
            'approved',
            'date_approved',
            'approve_url',
            'delete_url',
            'extracurricular_image_field'
        ]

    def get_approve_url(self, obj):
        return reverse('category-submission-approve', kwargs={'id': obj.id})

    def get_delete_url(self, obj):
        return reverse('category-submission-delete', kwargs={'id': obj.id})


class UndergraduateToBeApprovedSubmissionsDeleteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateToBeApprovedSubmissions
        fields = []


class UndergraduateToBeApprovedSubmissionsApproveSerializer(serializers.ModelSerializer):
    submission_username = serializers.CharField(read_only=True)
    category = serializers.SlugRelatedField(slug_field='category', read_only=True)
    submission_field_one = serializers.CharField(read_only=True)
    submission_field_two = serializers.CharField(read_only=True)
    submission_field_three = serializers.CharField(read_only=True)
    date_submitted = serializers.DateField(read_only=True)
    approved = serializers.BooleanField(read_only=True)
    date_approved = serializers.DateField(read_only=True)
    extracurricular_image_field = serializers.FileField(read_only=True)

    class Meta:
        model = UndergraduateToBeApprovedSubmissions
        fields = [
            'submission_username',
            'category',
            'submission_field_one',
            'submission_field_two',
            'submission_field_three',
            'date_submitted',
            'approved',
            'date_approved',
            'extracurricular_image_field'
        ]

    def update(self, instance, validated_data):
        category = instance.category.category
        match category:
            case 'track':
                UndergraduateTigerBookTracks.objects.create(track=instance.submission_field_one)
            case 'concentration':
                UndergraduateTigerBookConcentrations.objects.create(concentration=instance.submission_field_one)
            case 'residential_college':
                UndergraduateTigerBookResidentialColleges.objects.create(
                    residential_college=instance.submission_field_one)
            case 'certificate':
                UndergraduateTigerBookCertificates.objects.create(certificate=instance.submission_field_one)
            case 'research_type':
                TigerBookResearchTypes.objects.create(research_type=instance.submission_field_one)
            case 'interest':
                TigerBookInterests.objects.create(interest=instance.submission_field_one)
            case 'extracurricular_subgroup':
                TigerBookExtracurricularSubgroups.objects.create(subgroup=instance.submission_field_one)
            case 'extracurricular_position':
                TigerBookExtracurricularPositions.objects.create(position=instance.submission_field_one)
            case 'housing':
                UndergraduateTigerBookHousing.objects.create(building=instance.submission_field_one,
                                                             room_no=instance.submission_field_two)
            case 'city':
                city = instance.submission_field_one
                admin_name = instance.submission_field_two
                country = instance.submission_field_three
                TigerBookCities.objects.create(city=city,
                                               admin_name=admin_name,
                                               country=country)
            case 'extracurricular':
                extracurricular = instance.submission_field_one
                subgroup = instance.submission_field_two
                subgroup_query = TigerBookExtracurricularSubgroups.objects.filter(subgroup=subgroup) \
                    .first()
                image_url = instance.extracurricular_image_field
                if not subgroup_query:
                    subgroup_object = TigerBookExtracurricularSubgroups.objects.create(subgroup=subgroup)
                TigerBookExtracurriculars.objects.create(extracurricular=extracurricular,
                                                         subgroup=subgroup_object,
                                                         image_url=image_url)

        instance.date_approved = datetime.date.today()
        instance.save()
        return instance
