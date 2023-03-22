from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (UndergraduateProfileSetupFirstPage, get_routes, UndergraduateFullProfileEdit,
                    UndergraduateProfileSetupSecondPage, UndergraduateTigerBookDirectoryList,
                    UndergraduateTigerBookDirectoryRetrieve, TigerBookRedirectURLView,
                    UndergraduateFullProfilePreview)
from uniauth.views import get_jwt_tokens_from_session

urlpatterns = [
    path('', get_routes),
    path('redirect/', TigerBookRedirectURLView.as_view()),
    path('undergraduate/profile/setup/1/', UndergraduateProfileSetupFirstPage.as_view(),
         name="undergraduate-setup-first-page"),
    path('undergraduate/profile/setup/2/', UndergraduateProfileSetupSecondPage.as_view(),
         name="undergraduate-setup-second-page"),
    path('undergraduate/profile/edit/', UndergraduateFullProfileEdit.as_view()),
    path('undergraduate/profile/preview/', UndergraduateFullProfilePreview.as_view()),
    path('undergraduates/all/', UndergraduateTigerBookDirectoryList.as_view(),
         name="undergraduates-all"),
    path('search/', UndergraduateTigerBookDirectoryList.as_view(),
         name="search"),
    path('undergraduates/<str:username>/', UndergraduateTigerBookDirectoryRetrieve.as_view(),
         name="undergraduate-retrieve"),
    path("token/", get_jwt_tokens_from_session, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
