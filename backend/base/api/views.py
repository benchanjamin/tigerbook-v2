from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin, ListModelMixin, RetrieveModelMixin

from base.models import UndergraduateTigerBookDirectory
from base.serializers import (
    UndergraduateTigerBookDirectorySetupFirstPageSerializer,
    UndergraduateTigerBookDirectoryProfileFullSerializer,
    UndergraduateTigerBookDirectorySetupSecondPageSerializer, UndergraduateTigerBookDirectoryListSerializer,
    UndergraduateTigerBookDirectoryRetrieveSerializer,
)

from django.conf import settings


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
        lookup = Q(user__username__exact=self.request.user.username) & Q(user__cas_profile__pu_status=
                                                                         settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj


class UndergraduateProfileSetupFirstPage(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectorySetupFirstPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        lookup = Q(user__username__exact=self.request.user.username) & Q(user__cas_profile__pu_status=
                                                                         settings.PU_STATUS_UNDERGRADUATE)
        return qs.filter(lookup)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

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
        return self.update(request, *args, **kwargs)


class UndergraduateFullProfileEdit(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.has_setup_profile:
            return Response({"invalid": "full profile post request is not allowed until setup profile is complete"})
        return self.update(request, *args, **kwargs)


class UndergraduateFullProfilePreview(UndergraduateProfileEdit):
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def get(self, request):
        instance = self.get_object()
        if not (instance.has_setup_profile.has_setup_stage_one and instance.has_setup_profile.has_setup_stage_two):
            return Response({"invalid": "full profile get request is not allowed until setup profile is complete"})
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

        # Perform the lookup filtering.
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field

        assert lookup_url_kwarg in self.kwargs, (
                'Expected view %s to be called with a URL keyword argument '
                'named "%s". Fix your URL conf, or set the `.lookup_field` '
                'attribute on the view correctly.' %
                (self.__class__.__name__, lookup_url_kwarg)
        )
        filter_kwargs = {"user__username__exact": self.kwargs[lookup_url_kwarg]}

        # filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
        obj = get_object_or_404(queryset, **filter_kwargs)

        # May raise a permission denied
        self.check_object_permissions(self.request, obj)

        return obj

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
