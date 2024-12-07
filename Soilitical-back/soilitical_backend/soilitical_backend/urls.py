from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, MyTokenObtainPairView


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/', include('api.urls')),

]
