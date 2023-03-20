from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import MyProfileSetupFirstPage, get_routes, MyFullProfile, MyProfileSetupSecondPage
from uniauth.views import get_jwt_tokens_from_session

urlpatterns = [
    path('', get_routes),
    path('setup/1/', MyProfileSetupFirstPage.as_view()),
    path('setup/2/', MyProfileSetupSecondPage.as_view()),
    path('profile/', MyFullProfile.as_view()),
    path("token/", get_jwt_tokens_from_session, name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
