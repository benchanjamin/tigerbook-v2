from django.contrib.auth.models import User
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.mixins import UpdateModelMixin, ListModelMixin, RetrieveModelMixin, CreateModelMixin, \
    DestroyModelMixin

from base.models import UndergraduateTigerBookDirectory, TigerBookNotes, GenericTigerBookDirectory, \
    UndergraduateToBeApprovedSubmissions, UndergraduateTigerBookConcentrations, UndergraduateTigerBookClassYears, \
    UndergraduateTigerBookResidentialColleges, TigerBookCities, UndergraduateTigerBookCertificates, \
    UndergraduateTigerBookTracks, TigerBookPronouns, TigerBookInterests, TigerBookExtracurriculars, \
    UndergraduateTigerBookHousing, TigerBookExtracurricularPositions, TigerBookResearchTypes
from base.pagination import StandardResultsSetPagination
from base.serializers import (
    UndergraduateTigerBookDirectorySetupFirstPageSerializer,
    UndergraduateTigerBookDirectoryProfileFullSerializer,
    UndergraduateTigerBookDirectorySetupSecondPageSerializer, UndergraduateTigerBookDirectoryListSerializer,
    UndergraduateTigerBookDirectoryRetrieveSerializer, TigerBookNotesCreateSerializer,
    TigerBookNotesListSerializer, TigerBookNotesUpdateSerializer, UndergraduateToBeApprovedSubmissionsCreateSerializer,
    UndergraduateToBeApprovedSubmissionsListSerializer, UndergraduateToBeApprovedSubmissionsDeleteSerializer,
    UndergraduateToBeApprovedSubmissionsApproveSerializer, UndergraduateTigerBookDirectorySearchSerializer,
    UndergraduateConcentrationsListAPISerializer, UndergraduateClassYearsListAPISerializer,
    UndergraduateResidentialCollegesListAPISerializer, CitiesListAPISerializer,
    UndergraduateCertificatesListAPISerializer, UndergraduateTracksListAPISerializer,
    PronounsListAPISerializer, TigerBookHeaderSerializer, TigerBookHometownMapSerializer, InterestsListAPISerializer,
    ExtracurricularsListAPISerializer, HousingListAPISerializer, ExtracurricularsPositionsListAPISerializer,
    UndergraduateTigerBookDirectoryPreviewSerializer, TigerBookCurrentCityMapSerializer, ResearchTypesAPISerializer,
)

from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from base.utils import get_display_username
from base.filters import UndergraduateDirectoryListFilter


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


class UndergraduateConcentrationsListAPIView(ListAPIView):
    serializer_class = UndergraduateConcentrationsListAPISerializer
    queryset = UndergraduateTigerBookConcentrations.objects.all().order_by('concentration')


class UndergraduateClassYearsListAPIView(ListAPIView):
    serializer_class = UndergraduateClassYearsListAPISerializer
    queryset = UndergraduateTigerBookClassYears.objects.all().order_by('-class_year')


class UndergraduateResidentialCollegesListAPIView(ListAPIView):
    serializer_class = UndergraduateResidentialCollegesListAPISerializer
    queryset = UndergraduateTigerBookResidentialColleges.objects.all().order_by('residential_college')


class CitiesListAPIView(ListAPIView):
    serializer_class = CitiesListAPISerializer
    queryset = TigerBookCities.objects.all().order_by('city')


class UndergraduateCertificatesListAPIView(ListAPIView):
    serializer_class = UndergraduateCertificatesListAPISerializer
    queryset = UndergraduateTigerBookCertificates.objects.all().order_by('certificate')


class UndergraduateTracksListAPIView(ListAPIView):
    serializer_class = UndergraduateTracksListAPISerializer
    queryset = UndergraduateTigerBookTracks.objects.all().order_by('track')


class PronounsListAPIView(ListAPIView):
    serializer_class = PronounsListAPISerializer
    queryset = TigerBookPronouns.objects.all().order_by('pronouns')


class InterestsListAPIView(ListAPIView):
    serializer_class = InterestsListAPISerializer
    queryset = TigerBookInterests.objects.all().order_by('interest')


class ExtracurricularsListAPIView(ListAPIView):
    serializer_class = ExtracurricularsListAPISerializer
    queryset = TigerBookExtracurriculars.objects.all().order_by('extracurricular')


class ExtracurricularPositionsListAPIView(ListAPIView):
    serializer_class = ExtracurricularsPositionsListAPISerializer
    queryset = TigerBookExtracurricularPositions.objects.all().order_by('position')


class HousingListAPIView(ListAPIView):
    serializer_class = HousingListAPISerializer
    queryset = UndergraduateTigerBookHousing.objects.all().order_by('building', 'room_no')


class ResearchTypesListAPIView(ListAPIView):
    serializer_class = ResearchTypesAPISerializer
    queryset = TigerBookResearchTypes.objects.all().order_by('research_type')


class TigerBookRedirectURLView(GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")

    def get_queryset(self):
        qs = super().get_queryset()
        lookup = Q(user__username__exact=self.request.user.username) & Q(user__cas_profile__pu_status=
                                                                         settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, user=self.request.user)

    def get(self, request, *args, **kwargs):
        user = request.user
        result = {"redirect_url": reverse('search')}
        # if user does not have a tigerbook directory entry, redirect to list page
        if not hasattr(user, 'undergraduate_tigerbook_directory_entry'):
            return Response(result)
        # if user has a tigerbook directory entry and has not done first setup page,
        # redirect to first setup page
        tigerbook_directory_obj = self.get_object()
        if not tigerbook_directory_obj.has_setup_profile.has_setup_page_one:
            result = {"redirect_url": reverse('undergraduate-setup-first-page')}
            return Response(result)
        # if user has a tigerbook directory entry and has not done second setup page,
        # redirect to second setup page
        if not tigerbook_directory_obj.has_setup_profile.has_setup_page_two:
            result = {"redirect_url": reverse('undergraduate-setup-second-page')}
            return Response(result)
        # if user has a tigerbook directory entry and has done both setup pages, redirect
        # to list page
        # TODO: make search page the default page instead of list page
        return Response(result)


class UndergraduateProfileEdit(UpdateModelMixin, GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")

    def get_queryset(self):
        qs = super().get_queryset()
        lookup = Q(user__username__exact=self.request.user.username) & Q(
            user__cas_profile__pu_status=
            settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, user=self.request.user)


class TigerBookHometownMapView(ListModelMixin, GenericAPIView):
    queryset = TigerBookCities.objects.all()
    serializer_class = TigerBookHometownMapSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.exclude(undergraduates_hometown__isnull=True)
        return qs

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TigerBookCurrentCityMapView(ListModelMixin, GenericAPIView):
    queryset = TigerBookCities.objects.all()
    serializer_class = TigerBookCurrentCityMapSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.exclude(undergraduates_current_city__isnull=True)
        return qs

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TigerBookHeaderView(GenericAPIView):
    queryset = User.objects.all().select_related("undergraduate_tigerbook_directory_entry")
    serializer_class = TigerBookHeaderSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        lookup = Q(username__exact=self.request.user.username)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        return queryset.first()

    def get(self, request):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)


class UndergraduateProfileSetupFirstPageView(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectorySetupFirstPageSerializer

    def get(self, request):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class UndergraduateProfileSetupSecondPageView(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectorySetupSecondPageSerializer

    # def get(self, request):
    #     instance = self.get_object()
    #     if not instance.has_setup_profile.has_setup_page_one:
    #         return Response(
    #             {"invalid": "setup profile page two is not allowed until setup profile page one is complete"},
    #             status=status.HTTP_403_FORBIDDEN)
    #     serializer = self.serializer_class(instance)
    #     return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.has_setup_profile.has_setup_page_one:
            return self.update(request, *args, **kwargs)
        return Response(
            {"invalid": "setup profile page two is not allowed until setup profile page one is complete"},
            status=status.HTTP_403_FORBIDDEN)


class UndergraduateFullProfileEditView(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.has_setup_profile.has_setup_page_one and instance.has_setup_profile.has_setup_page_two:
            return self.update(request, *args, **kwargs)
        return Response({"invalid": "full profile post request is not allowed until setup profile is complete"},
                        status=status.HTTP_403_FORBIDDEN)


class UndergraduateFullProfilePreviewView(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryPreviewSerializer

    def get(self, request):
        instance = self.get_object()
        if instance.has_setup_profile.has_setup_page_one and instance.has_setup_profile.has_setup_page_two:
            serializer = self.serializer_class(instance)
            return Response(serializer.data)
        return Response({"invalid": "full profile post request is not allowed until setup profile is complete"},
                        status=status.HTTP_403_FORBIDDEN)


# TODO: make search page the default page instead of list page
#   Should be able to lookup/convert from any of the University identifiers (PUID, NetID, alias, email).
class UndergraduateTigerBookDirectorySearchView(ListModelMixin,
                                                GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("active_directory_entry")
    serializer_class = UndergraduateTigerBookDirectorySearchSerializer

    def get_queryset(self, **kwargs):
        qs = super().get_queryset()
        query = self.request.GET.get('q', None)
        if query is None or query == '':
            return None
        lookup = Q(active_directory_entry__puid__icontains=query) | Q(
            active_directory_entry__net_id__icontains=query) | Q(
            aliases__icontains=query) | Q(
            active_directory_entry__full_name__icontains=query)
        # if query contains @ symbol, assume it's an email address
        if '@' in query:
            lookup = Q(active_directory_entry__email__icontains=query)
        return qs.filter(lookup).order_by('active_directory_entry__full_name')

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class UndergraduateTigerBookDirectoryListView(ListModelMixin,
                                              GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("permissions", "concentration",
                                                                            "class_year", "residential_college",
                                                                            "pronouns", "track",
                                                                            "residential_college_facebook_entry",
                                                                            "active_directory_entry")
    serializer_class = UndergraduateTigerBookDirectoryListSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = UndergraduateDirectoryListFilter

    # TODO: Add pagination
    # pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request
        pu_status = request.user.cas_profile.pu_status
        first_lookup = None
        match pu_status:
            case 'fac':
                first_lookup = Q(permissions__is_visible_to_faculty=False)
            case 'undergraduate':
                first_lookup = Q(permissions__is_visible_to_undergrads=False)
            case 'graduate':
                first_lookup = Q(permissions__is_visible_to_graduate_students=False)
            case 'stf':
                first_lookup = Q(permissions__is_visible_to_staff=False)
            case '#sv':
                first_lookup = Q(permissions__is_visible_to_service_accounts=False)
        query = request.GET.get('q', '')
        second_lookup = Q(active_directory_entry__puid__icontains=query) | Q(
            active_directory_entry__net_id__icontains=query) | Q(
            aliases__icontains=query) | Q(
            active_directory_entry__full_name__icontains=query)
        # if query contains @ symbol, assume it's an email address
        if '@' in query:
            second_lookup = Q(active_directory_entry__email__icontains=query)
        return qs.exclude(first_lookup).filter(second_lookup).order_by('active_directory_entry__full_name')

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset, user=self.request.user)

    # TODO: decide whether this is needed to retrieve the display username
    # def list(self, request, *args, **kwargs):
    #     queryset = self.filter_queryset(self.get_queryset())
    #
    #     page = self.paginate_queryset(queryset)
    #     if page is not None:
    #         serializer = self.get_serializer(page, many=True)
    #         return self.get_paginated_response(serializer.data)
    #
    #     serializer = self.get_serializer(queryset, many=True)
    #     response = [{"display_username": get_display_username(request.user.username)}] + serializer.data
    #     return Response(response)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class UndergraduateTigerBookDirectoryRetrieveView(RetrieveModelMixin,
                                                  GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("permissions",
                                                                            "concentration",
                                                                            "class_year", "residential_college",
                                                                            "pronouns", "track",
                                                                            "residential_college_facebook_entry",
                                                                            "active_directory_entry").prefetch_related(
        "certificates", "interests", "extracurricular_objs", "extracurricular_position_objs", "research_objs"
    )

    serializer_class = UndergraduateTigerBookDirectoryRetrieveSerializer
    lookup_field = 'username'

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request
        pu_status = request.user.cas_profile.pu_status
        lookup = None
        match pu_status:
            case 'fac':
                lookup = Q(permissions__is_visible_to_faculty=False)
            case 'undergraduate':
                lookup = Q(permissions__is_visible_to_undergrads=False)
            case 'graduate':
                lookup = Q(permissions__is_visible_to_graduate_students=False)
            case 'stf':
                lookup = Q(permissions__is_visible_to_staff=False)
            case '#sv':
                lookup = Q(permissions__is_visible_to_service_accounts=False)
        return qs.exclude(lookup)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        lookup = Q(user__username__exact=
                   self.kwargs[self.lookup_field]) | Q(user__cas_profile__net_id__exact=
                                                       self.kwargs[self.lookup_field])
        return get_object_or_404(queryset, lookup)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)


class TigerBookNotesCreateView(CreateModelMixin,
                               GenericAPIView):
    queryset = TigerBookNotes.objects.all().select_related('notes_taking_user')
    serializer_class = TigerBookNotesCreateSerializer
    lookup_field = 'username'

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        lookup = Q(notes_taking_user=user)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = self.request.user
        note_title = serializer.validated_data.get('note_title')
        note_description = serializer.validated_data.get('note_description')
        try:
            target_directory_entry = GenericTigerBookDirectory.objects.get(tigerbook_directory_username__iexact
                                                                           =self.kwargs[self.lookup_field])
        except GenericTigerBookDirectory.DoesNotExist:
            try:
                target_directory_entry = GenericTigerBookDirectory.objects.get(
                    tigerbook_directory_username__iexact=f"cas-princeton-{self.kwargs[self.lookup_field]}")
            except GenericTigerBookDirectory.DoesNotExist as exception:
                raise serializers.ValidationError(
                    'GenericTigerBookDirectory object does not exist.'
                ) from exception

        serializer.save(
            notes_taking_user=user,
            note_title=note_title,
            note_description=note_description,
            target_directory_entries=[get_display_username(target_directory_entry.tigerbook_directory_username)],
        )


class TigerBookNotesUpdateView(RetrieveModelMixin,
                               UpdateModelMixin,
                               GenericAPIView):
    queryset = TigerBookNotes.objects.all().select_related('notes_taking_user')
    serializer_class = TigerBookNotesUpdateSerializer
    lookup_field = 'id'

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        lookup = Q(notes_taking_user=user)
        return qs.filter(lookup)

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if self.get_object():
            return self.update(request, *args, **kwargs)
        return Response({"invalid": "must update existing note"},
                        status=status.HTTP_404_NOT_FOUND)

    def perform_update(self, serializer):
        user = self.request.user
        note_title = serializer.validated_data.get('note_title')
        note_description = serializer.validated_data.get('note_description')
        target_directory_entries = []
        for username in serializer.validated_data.get('target_directory_entries'):
            try:
                GenericTigerBookDirectory.objects.get(tigerbook_directory_username__iexact
                                                      =username)
            except GenericTigerBookDirectory.DoesNotExist:
                try:
                    GenericTigerBookDirectory.objects.get(
                        tigerbook_directory_username=f"cas-princeton-{username}")
                except GenericTigerBookDirectory.DoesNotExist as exception:
                    raise serializers.ValidationError(
                        'GenericTigerBookDirectory object does not exist.'
                    ) from exception
            target_directory_entries.append(username)

        serializer.save(
            notes_taking_user=user,
            note_title=note_title,
            note_description=note_description,
            target_directory_entries=target_directory_entries,
        )


class TigerBookNotesListView(ListModelMixin,
                             GenericAPIView):
    queryset = TigerBookNotes.objects.all().select_related('notes_taking_user')
    serializer_class = TigerBookNotesListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        lookup = Q(notes_taking_user=user) | Q(shared_usernames__contains=user.username) | Q(
            shared_usernames__contains=get_display_username(user.username))
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        return get_object_or_404(queryset)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class TigerBookNotesDeleteView(DestroyModelMixin,
                               GenericAPIView):
    queryset = TigerBookNotes.objects.all().select_related('notes_taking_user')
    serializer_class = TigerBookNotesListSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsCreateView(CreateModelMixin,
                                                     GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsCreateSerializer

    def post(self, request, *args, **kwargs):
        return self.create(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsListView(ListModelMixin,
                                                   GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsListSerializer

    def get(self, request, *args, **kwargs):
        # add permission check
        display_username = get_display_username(request.user.username)
        if display_username not in settings.TIGERBOOK_ADMIN_NETIDS.split(","):
            return Response({"invalid": "must be a tigerbook admin"},
                            status=status.HTTP_403_FORBIDDEN)
        return self.list(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsDeleteView(DestroyModelMixin,
                                                     GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsDeleteSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        # add permission check
        display_username = get_display_username(request.user.username)
        if display_username not in settings.TIGERBOOK_ADMIN_NETIDS.split(","):
            return Response({"invalid": "must be a tigerbook admin"},
                            status=status.HTTP_403_FORBIDDEN)
        return self.destroy(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsApproveView(RetrieveModelMixin,
                                                      UpdateModelMixin,
                                                      GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsApproveSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        # add permission check
        display_username = get_display_username(request.user.username)
        if display_username not in settings.TIGERBOOK_ADMIN_NETIDS.split(","):
            return Response({"invalid": "must be a tigerbook admin"},
                            status=status.HTTP_403_FORBIDDEN)
        return self.update(request, *args, **kwargs)
