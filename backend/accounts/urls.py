from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

urlpatterns = [
    path('register/', views.UserRegistrationAPIView.as_view(), name='register-user'),
    path('login/', views.UserLoginAPIView.as_view(), name='login-user'),
    path('logout/', views.UserLogoutAPIView.as_view(), name='logout-user'),
    path('profile/', views.CustomUserProfileAPIView.as_view(), name='user-profile'),

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]