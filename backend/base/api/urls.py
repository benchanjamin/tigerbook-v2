from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView, TokenObtainPairView
from .views import (UndergraduateProfileSetupFirstPageView, get_routes, UndergraduateFullProfileEditView,
                    UndergraduateProfileSetupSecondPageView, UndergraduateTigerBookDirectoryListView,
                    UndergraduateTigerBookDirectoryRetrieveView, TigerBookRedirectURLView,
                    UndergraduateFullProfilePreviewView, TigerBookNotesCreateView, TigerBookNotesListView,
                    TigerBookNotesUpdateView, TigerBookNotesDeleteView, UndergraduateToBeApprovedSubmissionsCreateView,
                    UndergraduateToBeApprovedSubmissionsListView, UndergraduateToBeApprovedSubmissionsDeleteView,
                    UndergraduateToBeApprovedSubmissionsApproveView, UndergraduateTigerBookDirectorySearchView,
                    UndergraduateConcentrationsListAPIView, UndergraduateTracksListAPIView,
                    UndergraduateCertificatesListAPIView, CitiesListAPIView, UndergraduateClassYearsListAPIView,
                    UndergraduateResidentialCollegesListAPIView, PronounsListAPIView, TigerBookHeaderView,
                    TigerBookMapView)
from uniauth.views import get_jwt_tokens_from_session

urlpatterns = [
    path('', get_routes),
    path('redirect/', TigerBookRedirectURLView.as_view()),
    path('header/', TigerBookHeaderView.as_view(),
         name="header"),
    path('map/', TigerBookMapView.as_view(),
         name="header"),
    path('undergraduate/profile/setup/one/', UndergraduateProfileSetupFirstPageView.as_view(),
         name="undergraduate-setup-first-page"),
    path('undergraduate/profile/setup/two/', UndergraduateProfileSetupSecondPageView.as_view(),
         name="undergraduate-setup-second-page"),
    path('undergraduate/profile/edit/', UndergraduateFullProfileEditView.as_view()),
    path('undergraduate/profile/preview/', UndergraduateFullProfilePreviewView.as_view()),
    # TODO: generalize this to work for all directory entries instead of just undergraduates,
    #  if there's time
    path('list/', UndergraduateTigerBookDirectoryListView.as_view(),
         name="undergraduates-all"),
    # TODO: add search functionality
    path('search/', UndergraduateTigerBookDirectorySearchView.as_view(), name="search"),
    path('notes/', TigerBookNotesListView.as_view(), name='individual-notes-list'),
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
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # TODO: generalize this to work for all directory entries instead of just undergraduates
    #   if there's time
    path('directory/<str:username>/', UndergraduateTigerBookDirectoryRetrieveView.as_view(),
         name="undergraduate-retrieve"),
    path('note/create/<str:username>/', TigerBookNotesCreateView.as_view(),
         name='individual-note-create'),
    path('note/update/<str:id>/', TigerBookNotesUpdateView.as_view(),
         name='individual-note-update'),
    path('note/delete/<str:id>/', TigerBookNotesDeleteView.as_view(),
         name='individual-note-delete'),
    path('concentrations/', UndergraduateConcentrationsListAPIView.as_view()),
    path('tracks/', UndergraduateTracksListAPIView.as_view()),
    path('residential-colleges/', UndergraduateResidentialCollegesListAPIView.as_view()),
    path('class-years/', UndergraduateClassYearsListAPIView.as_view()),
    path('cities/', CitiesListAPIView.as_view()),
    path('certificates/', UndergraduateCertificatesListAPIView.as_view()),
    path('pronouns/', PronounsListAPIView.as_view()),

]
