from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin, UpdateModelMixin
from rest_framework.views import APIView

from base.models import UndergraduateTigerBookDirectory
from base.serializers import (
    UndergraduateTigerBookDirectorySetupFirstPageSerializer,
    UndergraduateTigerBookDirectoryProfileFullSerializer,
    UndergraduateTigerBookDirectorySetupSecondPageSerializer,
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
    queryset = UndergraduateTigerBookDirectory.objects.all()
    serializer_class = UndergraduateTigerBookDirectorySetupFirstPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        if request.user.username.startswith("cas"):
            net_id = get_account_username_split(request.user.username)[2]
            instance = UndergraduateTigerBookDirectory.objects.get(active_directory_entry_id=net_id)
            serializer = UndergraduateTigerBookDirectorySetupFirstPageSerializer(instance)
            return Response(serializer.data)
        return Response({"invalid": "setup profile view not allowed"}, status=400)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



class MyProfileSetupSecondPage(UpdateModelMixin,
                               GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all()
    serializer_class = UndergraduateTigerBookDirectorySetupSecondPageSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        if request.user.username.startswith("cas"):
            net_id = get_account_username_split(request.user.username)[2]
            instance = UndergraduateTigerBookDirectory.objects.get(active_directory_entry_id=net_id)
            serializer = UndergraduateTigerBookDirectorySetupSecondPageSerializer(instance)
            return Response(serializer.data)
        return Response({"invalid": "setup profile view not allowed"}, status=400)

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)



class MyFullProfile(UpdateModelMixin,
                    GenericAPIView):
    queryset = UndergraduateTigerBookDirectory.objects.all()
    serializer_class = UndergraduateTigerBookDirectoryProfileFullSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.filter(user__username__exact=self.request.user.username)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def get(self, request):
        if request.user.username.startswith("cas"):
            net_id = get_account_username_split(request.user.username)[2]
            instance = UndergraduateTigerBookDirectory.objects.get(active_directory_entry_id=net_id)
            if not (instance.has_setup_profile.has_setup_stage_one and instance.has_setup_profile.has_setup_stage_two):
                return Response({"invalid": "full profile get request is not allowed until setup profile is complete"})
            serializer = UndergraduateTigerBookDirectoryProfileFullSerializer(instance)
            return Response(serializer.data)
        return Response({"invalid": "full profile view not allowed"}, status=400)

    def post(self, request, *args, **kwargs):
        if request.user.username.startswith("cas"):
            net_id = get_account_username_split(request.user.username)[2]
            instance = UndergraduateTigerBookDirectory.objects.get(active_directory_entry_id=net_id)
            if not instance.has_setup_profile:
                return Response({"invalid": "full profile post request is not allowed until setup profile is complete"})
        return self.update(request, *args, **kwargs)
