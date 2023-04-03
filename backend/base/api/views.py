from django.contrib.contenttypes.models import ContentType
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework import status, serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, ListModelMixin, RetrieveModelMixin, CreateModelMixin, \
    DestroyModelMixin

from base.models import UndergraduateTigerBookDirectory, TigerBookNotes, GenericTigerBookDirectory, \
    UndergraduateToBeApprovedSubmissions
from base.serializers import (
    UndergraduateTigerBookDirectorySetupFirstPageSerializer,
    UndergraduateTigerBookDirectoryProfileFullSerializer,
    UndergraduateTigerBookDirectorySetupSecondPageSerializer, UndergraduateTigerBookDirectoryListSerializer,
    UndergraduateTigerBookDirectoryRetrieveSerializer, TigerBookNotesCreateSerializer,
    TigerBookNotesListSerializer, TigerBookNotesUpdateSerializer, UndergraduateToBeApprovedSubmissionsCreateSerializer,
    UndergraduateToBeApprovedSubmissionsListSerializer, UndergraduateToBeApprovedSubmissionsDeleteSerializer,
    UndergraduateToBeApprovedSubmissionsApproveSerializer,
)

from django.conf import settings

from base.utils import get_display_username


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


class TigerBookRedirectURLView(GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")

    def get_queryset(self):
        qs = super().get_queryset()
        lookup = Q(user__username__exact=self.request.user.username) & Q(user__cas_profile__pu_status=
                                                                         settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request, *args, **kwargs):
        user = request.user
        result = {"redirect_url": reverse('undergraduates-all')}
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
        lookup = Q(user=self.request.user) & Q(user__cas_profile__pu_status=
                                               settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj


class UndergraduateProfileSetupFirstPage(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectorySetupFirstPageSerializer

    def get(self, request):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class UndergraduateProfileSetupSecondPage(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectorySetupSecondPageSerializer

    def get(self, request):
        instance = self.get_object()
        serializer = self.serializer_class(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.has_setup_profile.has_setup_page_one:
            return Response(
                {"invalid": "setup profile page two is not allowed until setup profile page one is complete"})
        return self.update(request, *args, **kwargs)


class UndergraduateFullProfileEdit(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if not (instance.has_setup_profile.has_setup_page_one and instance.has_setup_profile.has_setup_page_two):
            return Response({"invalid": "full profile post request is not allowed until setup profile is complete"},
                            status=status.HTTP_404_NOT_FOUND)
        return self.update(request, *args, **kwargs)


class UndergraduateFullProfilePreview(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def get(self, request):
        instance = self.get_object()
        if not (instance.has_setup_profile.has_setup_page_one and instance.has_setup_profile.has_setup_page_two):
            return Response({"invalid": "full profile get request is not allowed until setup profile is complete"},
                            status=status.HTTP_404_NOT_FOUND)
        serializer = self.serializer_class(instance)
        return Response(serializer.data)


class UndergraduateTigerBookDirectoryList(ListModelMixin,
                                          GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("permissions", "concentration",
                                                                            "class_year", "residential_college",
                                                                            "pronouns", "track",
                                                                            "residential_college_facebook_entry",
                                                                            "active_directory_entry")
    serializer_class = UndergraduateTigerBookDirectoryListSerializer

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
        queryset = self.get_queryset()
        return get_object_or_404(queryset, user=self.request.user)

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)


class UndergraduateTigerBookDirectoryRetrieve(RetrieveModelMixin,
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
        obj = get_object_or_404(queryset, lookup)

        return obj

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
                target_directory_entry = GenericTigerBookDirectory.objects.get(tigerbook_directory_username__iexact
                                                                               =username)
            except GenericTigerBookDirectory.DoesNotExist:
                try:
                    target_directory_entry = GenericTigerBookDirectory.objects.get(
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
        lookup = Q(notes_taking_user=user)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset)
        return obj

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
        return self.list(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsDeleteView(DestroyModelMixin,
                                                     GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsDeleteSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class UndergraduateToBeApprovedSubmissionsApproveView(RetrieveModelMixin,
                                                      UpdateModelMixin,
                                                      GenericAPIView):
    queryset = UndergraduateToBeApprovedSubmissions.objects.all()
    serializer_class = UndergraduateToBeApprovedSubmissionsApproveSerializer
    lookup_field = 'id'

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
