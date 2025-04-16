from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', views.UserRegistrationAPIView.as_view(), name='register-user'),
    path('login/', views.UserLoginAPIView.as_view(), name='login-user'),
    path('logout/', views.UserLogoutAPIView.as_view(), name='logout-user'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]