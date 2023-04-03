from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (UndergraduateProfileSetupFirstPage, get_routes, UndergraduateFullProfileEdit,
                    UndergraduateProfileSetupSecondPage, UndergraduateTigerBookDirectoryList,
                    UndergraduateTigerBookDirectoryRetrieve, TigerBookRedirectURLView,
                    UndergraduateFullProfilePreview, TigerBookNotesCreateView, TigerBookNotesListView,
                    TigerBookNotesUpdateView, TigerBookNotesDeleteView)
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
    # TODO: generalize this to work for all directory entries instead of just undergraduates,
    #  if there's time
    path('directory/all/', UndergraduateTigerBookDirectoryList.as_view(),
         name="undergraduates-all"),
    # TODO: generalize this to work for all directory entries instead of just undergraduates
    #   if there's time
    path('directory/<str:username>/', UndergraduateTigerBookDirectoryRetrieve.as_view(),
         name="undergraduate-retrieve"),
    path('notes/', TigerBookNotesListView.as_view(), name='individual-notes-list'),
    path('note/create/<str:username>/', TigerBookNotesCreateView.as_view(),
         name='individual-note-create'),
    path('note/update/<str:id>/', TigerBookNotesUpdateView.as_view(),
         name='individual-note-update'),
    path('note/delete/<str:id>/', TigerBookNotesDeleteView.as_view(),
         name='individual-note-delete'),
    # TODO: add search functionality
    # path('directory/search/', UndergraduateTigerBookDirectoryList.as_view(),
    #      name="search"),
    # TODO: add validation for categories

    path("token/", get_jwt_tokens_from_session, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
