import re
from django.db.models import QuerySet, Manager
from rest_framework import serializers
from rest_framework.utils import model_meta

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
    UndergraduateTigerBookHousing
)
from uniauth.utils import get_account_username_split
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from drf_writable_nested.serializers import WritableNestedModelSerializer


# Serializers for general use for undergraduates

class UndergraduateTigerBookTracksSerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookTracks
        fields = [
            'track'
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


class UndergraduateTigerBookConcentrationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UndergraduateTigerBookConcentrations
        fields = [
            'concentration'
        ]


class TigerBookCitiesSerializer(serializers.RelatedField):
    def get_queryset(self):
        return TigerBookCities.objects.all()

    # TODO: referenced
    #  https://stackoverflow.com/questions/35257698/what-is-serializers-to-internal-value-method-used-for-in-django
    def to_internal_value(self, data):
        # data is the city str, e.g. "Fort Worth, Texas, United States"
        # enforce that the data type is a string
        if not isinstance(data, str):
            raise serializers.ValidationError(
                'City location must be a string.'
            )
        data = data.split(", ")
        try:
            if len(data) == 2:
                city, country = data
                return TigerBookCities.objects.get(city=city, country=country)
            elif len(data) == 3:
                city, admin_name, country = data
                return TigerBookCities.objects.get(city=city,
                                                   admin_name=admin_name,
                                                   country=country)
            else:
                raise serializers.ValidationError('Entered # of commas is not 2 or 3, each followed by a space,'
                                                  ' for a city location')
        except TigerBookCities.DoesNotExist:
            raise serializers.ValidationError(
                'TigerBookCities object does not exist.'
            )

    def to_representation(self, value):
        if hasattr(value, "admin_name") and value.admin_name != "":
            return f"{value.city}, {value.admin_name}, {value.country}"
        return f"{value.city}, {value.country}"


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


class UsernameSerializer(serializers.Serializer):
    username = serializers.SerializerMethodField(read_only=True)  # i.e, netId

    def get_username(self, obj):
        if obj.username.startswith("cas"):
            net_id = get_account_username_split(obj.username)[2]
            return net_id
        return obj.username


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
    aliases = serializers.ListField(allow_empty=True, allow_null=False, child=serializers.CharField(allow_blank=False))
    hometown = TigerBookCitiesSerializer(many=True)
    certificates = serializers.SlugRelatedField(many=True, slug_field='certificate',
                                                queryset=UndergraduateTigerBookCertificates.objects.all(),
                                                allow_null=False)
    pronouns = serializers.SlugRelatedField(slug_field='pronoun',
                                            queryset=TigerBookPronouns.objects.all(),
                                            allow_null=True)
    class_year = serializers.SlugRelatedField(slug_field='class_year',
                                              read_only=True)
    residential_college = serializers.SlugRelatedField(slug_field='residential_college',
                                                       queryset=UndergraduateTigerBookResidentialColleges.objects.all(),
                                                       allow_null=False)

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
            'residential_college'
        ]

    def get_username(self, obj):
        if hasattr(obj.user, 'cas_profile'):
            return obj.user.cas_profile.net_id
        return obj.username

    def update(self, instance, validated_data):
        instance.has_setup_profile.has_setup_stage_one = True
        instance.has_setup_profile.save()
        return super().update(instance, validated_data)


class UndergraduateTigerBookDirectorySetupSecondPageSerializer(serializers.ModelSerializer):
    # TODO: https://stackoverflow.com/questions/29373983/remove-a-file-in-amazon-s3-using-django-storages
    #   to delete old profile pic on
    profile_pic = serializers.FileField(allow_null=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'profile_pic'
        ]

    def update(self, instance, validated_data):
        try:
            if instance.profile_pic.url:
                instance.profile_pic.delete(save=False)
        except ValueError:
            pass
        instance.has_setup_profile.has_setup_stage_two = True
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
            if len(data) == 2:
                building, room_no = data
                return UndergraduateTigerBookHousing.objects.get(building__iexact=building, room_no=room_no)
            else:
                raise serializers.ValidationError(
                    'Entered # of commas is not 1 followed by a space for a housing location')
        except TigerBookCities.DoesNotExist:
            raise serializers.ValidationError(
                'UndergraduateTigerBookHousing object does not exist.'
            )

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
    pronouns = serializers.SlugRelatedField(slug_field='pronoun',
                                            queryset=TigerBookPronouns.objects.all(),
                                            allow_null=True, required=False)
    # # new fields are below compared to setup profile
    # TODO: default profile pic should be of res college facebook
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
        if hasattr(obj.user, 'cas_profile'):
            return obj.user.cas_profile.net_id
        return obj.username

    def update(self, instance, validated_data):
        try:
            # TODO: only change profile pic if profile pic is in validated data
            if instance.profile_pic.url and 'profile_pic' in validated_data:
                instance.profile_pic.delete(save=False)
        except ValueError:
            pass
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


class TigerBookDirectoryListSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField(read_only=True)
    track = serializers.SerializerMethodField(read_only=True)
    concentration = serializers.SerializerMethodField(read_only=True)
    class_year = serializers.SerializerMethodField(read_only=True)
    # TODO: make rest list serializable
    residential_college = serializers.SerializerMethodField(read_only=True)
    pronouns = serializers.SerializerMethodField(read_only=True)
    profile_pic_url = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = UndergraduateTigerBookDirectory
        fields = [
            'username',
            'active_directory_entry',
            'track',
            'concentration',
            'class_year',
            'residential_college',
            'pronouns',
            'profile_pic_url'
        ]

    def get_username(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.username_prohibited_usernames:
            return None
        if hasattr(obj.user, 'cas_profile'):
            return obj.user.cas_profile.net_id
        return obj.username

    def get_track(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.track_prohibited_usernames:
            return None
        if hasattr(obj.track, 'track'):
            return obj.track.track
        return None

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
        if hasattr(obj.pronouns, 'pronouns'):
            return obj.pronouns.pronouns
        return None

    def get_profile_pic_url(self, obj):
        request = self.context.get('request')
        if request.user.username in obj.permissions.profile_pic_prohibited_usernames:
            return None
        if obj.profile_pic:
            return obj.profile_pic.url
        elif hasattr(obj.residential_college_facebook_entry, 'url'):
            return obj.residential_college_facebook_entry.url
        else:
            return None