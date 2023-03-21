from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin, ListModelMixin
from rest_framework.views import APIView

from base.models import UndergraduateTigerBookDirectory
from base.serializers import (
    UndergraduateTigerBookDirectorySetupFirstPageSerializer,
    UndergraduateTigerBookDirectoryProfileFullSerializer,
    UndergraduateTigerBookDirectorySetupSecondPageSerializer, TigerBookDirectoryListSerializer,
)

from uniauth.utils import get_account_username_split


@api_view(['GET'])
def get_routes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]
    return Response(routes)


class MyProfileSetupFirstPage(UpdateModelMixin,
                              GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")
    serializer_class = UndergraduateTigerBookDirectorySetupFirstPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        instance = self.get_object()
        serializer = UndergraduateTigerBookDirectorySetupFirstPageSerializer(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class MyProfileSetupSecondPage(UpdateModelMixin,
                               GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")
    serializer_class = UndergraduateTigerBookDirectorySetupSecondPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        instance = self.get_object()
        serializer = UndergraduateTigerBookDirectorySetupSecondPageSerializer(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class MyFullProfile(UpdateModelMixin,
                    GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("user")
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        instance = self.get_object()
        if not (instance.has_setup_profile.has_setup_stage_one and instance.has_setup_profile.has_setup_stage_two):
            return Response({"invalid": "full profile get request is not allowed until setup profile is complete"})
        serializer = UndergraduateTigerBookDirectoryProfileFullSerializer(instance)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.has_setup_profile:
            return Response({"invalid": "full profile post request is not allowed until setup profile is complete"})
        return self.update(request, *args, **kwargs)


class TigerBookDirectoryList(ListModelMixin,
                             GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all().select_related("permissions", "concentration",
                                                                            "class_year", "residential_college",
                                                                            "pronouns", "track",
                                                                            "residential_college_facebook_entry",
                                                                            "active_directory_entry")
    serializer_class = TigerBookDirectoryListSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        request = self.request
        # net_id = request.user.profile.net_id
        pu_status = request.user.profile.pu_status
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
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request, *args, **kwargs):
        return self.list(request, *args, **kwargs)
        # if not (instance.has_setup_profile.has_setup_stage_one and instance.has_setup_profile.has_setup_stage_two):
        #     return Response({"invalid": "full profile get request is not allowed until setup profile is complete"})
        # serializer = UndergraduateTigerBookDirectoryProfileFullSerializer(instance)
        # return Response(serializer.data)
        # return Response({"invalid": "full profile view not allowed"}, status=400)
