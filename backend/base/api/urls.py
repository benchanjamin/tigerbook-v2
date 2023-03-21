from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (UndergraduateProfileSetupFirstPage, get_routes, UndergraduateProfileEdit,
                    UndergraduateProfileSetupSecondPage, UndergraduateTigerBookDirectoryList,
                    UndergraduateProfilePreview)
from uniauth.views import get_jwt_tokens_from_session

urlpatterns = [
    path('', get_routes),
    path('undergraduate/profile/setup/1/', UndergraduateProfileSetupFirstPage.as_view()),
    path('undergraduate/profile/setup/2/', UndergraduateProfileSetupSecondPage.as_view()),
    path('undergraduate/profile/edit/', UndergraduateProfileEdit.as_view()),
    path('undergraduate/profile/preview/', UndergraduateProfilePreview.as_view()),
    path('undergraduates/', UndergraduateTigerBookDirectoryList.as_view()),
    path("token/", get_jwt_tokens_from_session, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
