from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (UndergraduateProfileSetupFirstPageView, get_routes, UndergraduateFullProfileEditView,
                    UndergraduateProfileSetupSecondPageView, UndergraduateTigerBookDirectoryListView,
                    UndergraduateTigerBookDirectoryRetrieveView, TigerBookRedirectURLView,
                    UndergraduateFullProfilePreviewView, TigerBookNotesCreateView, TigerBookNotesListView,
                    TigerBookNotesUpdateView, TigerBookNotesDeleteView, UndergraduateToBeApprovedSubmissionsCreateView,
                    UndergraduateToBeApprovedSubmissionsListView, UndergraduateToBeApprovedSubmissionsDeleteView,
                    UndergraduateToBeApprovedSubmissionsApproveView, UndergraduateTigerBookDirectorySearchView)
from uniauth.views import get_jwt_tokens_from_session

urlpatterns = [
    path('', get_routes),
    path('redirect/', TigerBookRedirectURLView.as_view()),
    path('undergraduate/profile/setup/1/', UndergraduateProfileSetupFirstPageView.as_view(),
         name="undergraduate-setup-first-page"),
    path('undergraduate/profile/setup/2/', UndergraduateProfileSetupSecondPageView.as_view(),
         name="undergraduate-setup-second-page"),
    path('undergraduate/profile/edit/', UndergraduateFullProfileEditView.as_view()),
    path('undergraduate/profile/preview/', UndergraduateFullProfilePreviewView.as_view()),
    # TODO: generalize this to work for all directory entries instead of just undergraduates,
    #  if there's time
    path('directory/all/', UndergraduateTigerBookDirectoryListView.as_view(),
         name="undergraduates-all"),
    # TODO: generalize this to work for all directory entries instead of just undergraduates
    #   if there's time
    path('directory/user/<str:username>/', UndergraduateTigerBookDirectoryRetrieveView.as_view(),
         name="undergraduate-retrieve"),
    path('notes/', TigerBookNotesListView.as_view(), name='individual-notes-list'),
    path('note/create/<str:username>/', TigerBookNotesCreateView.as_view(),
         name='individual-note-create'),
    path('note/update/<str:id>/', TigerBookNotesUpdateView.as_view(),
         name='individual-note-update'),
    path('note/delete/<str:id>/', TigerBookNotesDeleteView.as_view(),
         name='individual-note-delete'),
    # TODO: add search functionality
    path('directory/search/', UndergraduateTigerBookDirectorySearchView.as_view(), name="search"),
    # TODO: add validation for categories
    path('category-submission/create/', UndergraduateToBeApprovedSubmissionsCreateView.as_view()),
    # TODO: below to be seen by tigerbook admins only
    path('category-submission/list/', UndergraduateToBeApprovedSubmissionsListView.as_view()),
    path('category-submission/delete/<str:id>/', UndergraduateToBeApprovedSubmissionsDeleteView.as_view(),
         name="category-submission-delete"),
    path('category-submission/approve/<str:id>/', UndergraduateToBeApprovedSubmissionsApproveView.as_view(),
         name="category-submission-approve"),
    path("token/", get_jwt_tokens_from_session, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
